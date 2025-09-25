import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmploymentType, OnboardingStep } from '../common/enums';
import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { UserContact } from '../users/entities/user-contact.entity';
import { User } from '../users/entities/user.entity';
import { Step1Dto } from './dto/step1.dto';
import { Step2Dto } from './dto/step2.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(UserContact) private readonly contactsRepo: Repository<UserContact>,
    @InjectRepository(Company) private readonly companiesRepo: Repository<Company>,
    @InjectRepository(Job) private readonly jobsRepo: Repository<Job>,
  ) {}

  getState(user: User): { step: OnboardingStep; completedAt?: string } {
    return {
      step: user.onboardingStep,
      completedAt: user.onboardingDoneAt ? user.onboardingDoneAt.toISOString() : undefined,
    };
  }

  async step1(user: User, dto: Step1Dto): Promise<{ user: User }> {
    if (dto.contacts.length > 5) throw new BadRequestException('TOO_MANY_CONTACTS');

    await this.usersRepo.update(
      { id: user.id },
      { firstName: dto.firstName, lastName: dto.lastName, onboardingEmployment: dto.employment },
    );

    const toSave: UserContact[] = dto.contacts.map((c, idx) =>
      this.contactsRepo.create({ userId: user.id, label: c.label, type: c.type as any, value: c.value, ord: c.ord ?? idx }),
    );

    // replace all contacts
    await this.contactsRepo.delete({ userId: user.id });
    for (const contact of toSave) await this.contactsRepo.save(contact);

    await this.usersRepo.update({ id: user.id }, { onboardingStep: OnboardingStep.STEP2 });
    const updated = await this.usersRepo.findOneByOrFail({ id: user.id });
    return { user: updated };
  }

  async step2(user: User, dto: Step2Dto): Promise<{ user: User; currentJob: Job | null }> {
    const employment = user.onboardingEmployment ?? EmploymentType.STUDENT;
    if (employment === EmploymentType.APPRENTICE || employment === EmploymentType.INTERN) {
      if (!dto.company) throw new BadRequestException('COMPANY_REQUIRED');
      if (!dto.startDate) throw new BadRequestException('START_DATE_REQUIRED');
    }

    let companyId: string | null = null;
    if (dto.company) {
      if (dto.company.id) {
        companyId = dto.company.id;
      } else if (dto.company.siren) {
        const c = await this.companiesRepo.findOne({ where: { siren: dto.company.siren } });
        if (!c) throw new NotFoundException('COMPANY_NOT_FOUND');
        companyId = c.id;
      } else if (dto.company.name) {
        const c = await this.companiesRepo.save(this.companiesRepo.create({ name: dto.company.name, verified: false }));
        companyId = c.id;
      }
    }

    // close existing current job
    const current = await this.jobsRepo.findOne({ where: { userId: user.id, endDate: null as any } });
    if (current && (employment === EmploymentType.APPRENTICE || employment === EmploymentType.INTERN || employment === EmploymentType.STUDENT)) {
      current.endDate = new Date().toISOString().slice(0, 10);
      await this.jobsRepo.save(current);
    }

    let newJob: Job | null = null;
    if (employment !== EmploymentType.NONE) {
      newJob = await this.jobsRepo.save(
        this.jobsRepo.create({
          userId: user.id,
          companyId: companyId,
          employment: employment,
          startDate: dto.startDate ?? null,
          endDate: dto.endDate ?? null,
          title: dto.title ?? null,
        }),
      );
    }

    await this.usersRepo.update(
      { id: user.id },
      { onboardingStep: OnboardingStep.DONE, onboardingDoneAt: new Date() },
    );
    const updated = await this.usersRepo.findOneByOrFail({ id: user.id });
    return { user: updated, currentJob: newJob };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";

import { FirebaseAdminService } from "../../config/firebase.service";
import { FirestoreRepository } from "../../common/repositories/firestore.repository";
import type { Company } from "./companies.types";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  private readonly repository: FirestoreRepository<Company>;

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {
    this.repository = new FirestoreRepository<Company>(this.firebaseAdmin.firestore, "companies");
  }

  findAll(filters: Partial<Company> = {}) {
    return this.repository.findAll(filters);
  }

  async findOne(id: string) {
    const company = await this.repository.findById(id);
    if (!company) {
      throw new NotFoundException(`Company ${id} not found`);
    }
    return company;
  }

  async create(dto: CreateCompanyDto) {
    return this.repository.create({ ...dto } as Company);
  }

  async update(id: string, dto: UpdateCompanyDto) {
    await this.repository.update(id, dto as Partial<Company>);
    return this.findOne(id);
  }

  async validateApprentice(companyId: string, studentId: string) {
    const company = await this.findOne(companyId);
    const validatedStudents = new Set(company.validatedStudents ?? []);
    validatedStudents.add(studentId);
    await this.repository.update(companyId, {
      validatedStudents: Array.from(validatedStudents),
    } as Partial<Company>);
    return this.findOne(companyId);
  }
}

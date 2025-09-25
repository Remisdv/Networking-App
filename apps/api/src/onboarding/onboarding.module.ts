import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from '../companies/entities/company.entity';
import { Job } from '../jobs/entities/job.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UserContact } from '../users/entities/user-contact.entity';
import { User } from '../users/entities/user.entity';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserContact, Company, Job]), AuthModule, UsersModule],
  controllers: [OnboardingController],
  providers: [OnboardingService, JwtAuthGuard, RolesGuard],
})
export class OnboardingModule {}

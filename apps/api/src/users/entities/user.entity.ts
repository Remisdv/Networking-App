import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { EmploymentType, OnboardingStep, UserRole } from '../../common/enums';

@Entity('users')
@Index('users_email_unique', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Exclude()
  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column({ name: 'terms_accepted_at', type: 'timestamptz' })
  termsAcceptedAt!: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'enum', enum: OnboardingStep, name: 'onboarding_step', default: OnboardingStep.STEP0 })
  onboardingStep!: OnboardingStep;

  @Column({ type: 'timestamptz', name: 'onboarding_done_at', nullable: true })
  onboardingDoneAt?: Date | null;

  @Column({ type: 'timestamptz', name: 'last_login_at', nullable: true })
  lastLoginAt?: Date | null;

  @Column({ type: 'enum', enum: EmploymentType, name: 'onboarding_employment', nullable: true })
  onboardingEmployment?: EmploymentType | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

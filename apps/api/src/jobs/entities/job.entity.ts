import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Company } from '../../companies/entities/company.entity';
import { EmploymentType } from '../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('jobs')
@Index('jobs_current_unique_user', ['userId'], { unique: true, where: 'end_date IS NULL' })
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'company_id' })
  company?: Company | null;

  @Column({ type: 'enum', enum: EmploymentType, default: EmploymentType.NONE })
  employment!: EmploymentType;

  @Column({ type: 'varchar', nullable: true })
  title?: string | null;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: string | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

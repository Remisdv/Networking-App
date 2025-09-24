import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../../companies/entities/company.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  location!: string;

  @Column({ name: 'contract_type', default: 'Alternance' })
  contractType!: string;

  @Column({ name: 'weekly_hours', type: 'int', nullable: true })
  weeklyHours?: number;

  @Column({ name: 'salary_range', nullable: true })
  salaryRange?: string;

  @Column({ type: 'jsonb', default: () => "'[]'::jsonb" })
  tags!: string[];

  @Column({ name: 'company_id' })
  companyId!: string;

  @ManyToOne(() => Company, (company) => company.offers, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

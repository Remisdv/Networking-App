import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Index('companies_siren_unique', { unique: true })
  @Column({ type: 'varchar', nullable: true })
  siren?: string | null;

  @Column({ type: 'varchar', nullable: true })
  ape?: string | null;

  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  city?: string;

  @Column({ type: 'varchar', nullable: true })
  region?: string;

  @Column({ type: 'varchar', nullable: true })
  country?: string;

  @Column({ default: false })
  verified!: boolean;

  // Offers removed in current scope

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

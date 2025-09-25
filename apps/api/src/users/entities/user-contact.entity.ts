import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ContactType } from '../../common/enums';
import { User } from './user.entity';

@Entity('user_contacts')
@Index('user_contacts_user_ord_idx', ['userId', 'ord'])
export class UserContact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  label!: string;

  @Column({ type: 'enum', enum: ContactType })
  type!: ContactType;

  @Column()
  value!: string;

  @Column({ type: 'int', default: 0 })
  ord!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}


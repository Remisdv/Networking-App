import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
@Index('refresh_tokens_user_idx', ['userId', 'expiresAt'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // jti

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text' })
  hashed!: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  ip?: string | null;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

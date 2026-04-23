import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('availabilities')
@Unique(['userId', 'dayOfWeek'])
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  dayOfWeek: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy?: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: string;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CalendarProvider } from '../../../lib/constants';

@Entity('calendars')
@Index(['userId', 'calendarId'], { unique: true })
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.calendars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ enum: CalendarProvider })
  providerId: CalendarProvider;

  @Column()
  externalId: string;

  @Column()
  name: string;

  @Column()
  timezone: string;

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

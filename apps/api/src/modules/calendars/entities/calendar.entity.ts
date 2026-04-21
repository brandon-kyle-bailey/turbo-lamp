import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CalendarProvider } from '../../../lib/constants';
import { MeetingGroup } from '../../meeting-groups/entities/meeting-group.entity';

@Entity('calendars')
@Index(['userId', 'externalId'], { unique: true })
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

  @OneToMany(() => MeetingGroup, (meetingGroup) => meetingGroup.creator)
  meetingGroups: MeetingGroup[];

  @Column()
  externalId: string;

  @Column()
  name: string;

  @Column()
  timezone: string;

  @Column()
  enabled: boolean;

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

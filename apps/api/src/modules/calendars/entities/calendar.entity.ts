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
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CalendarProvider } from '../../../libs/constants';
import { MeetingGroup } from '../../meeting-groups/entities/meeting-group.entity';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('calendars')
@Unique(['userId', 'externalId', 'providerId'])
@Index(['userId'])
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.calendars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.calendars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ enum: CalendarProvider })
  providerId: CalendarProvider;

  @OneToMany(() => MeetingGroup, (meetingGroup) => meetingGroup.author)
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

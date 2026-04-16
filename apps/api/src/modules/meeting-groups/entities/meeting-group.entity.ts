import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MeetingGroupStatus } from '../../../lib/constants';
import { Meeting } from '../../meetings/entities/meeting.entity';
import { MeetingSlot } from '../../meeting-slots/entities/meeting-slot.entity';
import { MeetingParticipant } from '../../meeting-participants/entities/meeting-participant.entity';

@Entity('meeting_groups')
export class MeetingGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Meeting, (meeting) => meeting.meetingGroup)
  meeting: Meeting;

  @OneToMany(() => MeetingSlot, (slot) => slot.meetingGroup)
  slots: MeetingSlot[];

  @OneToMany(
    () => MeetingParticipant,
    (meetingParticipant) => meetingParticipant.meetingGroup,
  )
  participants: MeetingParticipant[];

  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.meetingGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  summary: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  duration: number;

  @Column()
  after: Date;

  @Column()
  before: Date;

  @Column()
  timezone: string;

  @Column({ type: 'enum', enum: MeetingGroupStatus })
  status: MeetingGroupStatus;

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

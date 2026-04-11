import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Session } from '../../sessions/entities/session.entity';
import { MeetingGroup } from '../../meeting-groups/entities/meeting-group.entity';
import { MeetingAttendee } from '../../meeting-attendees/entities/meeting-attendee.entity';
import { MeetingParticipant } from '../../meeting-participants/entities/meeting-participant.entity';
import { Calendar } from '../../calendars/entities/calendar.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Calendar, (calendar) => calendar.user)
  calendars: Calendar[];

  @OneToMany(
    () => MeetingParticipant,
    (meetingParticipants) => meetingParticipants.user,
  )
  participations: MeetingParticipant[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => MeetingGroup, (meetingGroup) => meetingGroup.creator)
  meetingGroups: MeetingGroup[];

  @OneToMany(() => MeetingAttendee, (meetingAttendee) => meetingAttendee.userId)
  attendances: MeetingAttendee[];

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  emailVerified: boolean;

  @Column({ nullable: true })
  image?: string;

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

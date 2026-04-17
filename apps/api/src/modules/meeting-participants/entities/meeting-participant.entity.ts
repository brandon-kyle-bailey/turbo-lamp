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
import { MeetingGroup } from '../../meeting-groups/entities/meeting-group.entity';

@Entity('meeting_participants')
@Index(['meetingGroupId', 'email'], { unique: true })
export class MeetingParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.participations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  meetingGroupId: string;

  @ManyToOne(() => MeetingGroup, (meetingGroup) => meetingGroup.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meetingGroupId' })
  meetingGroup: MeetingGroup;

  @Column()
  email: string;

  @Column({ default: false })
  oauth_connected: boolean;

  @Column({ default: false })
  required: boolean;

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

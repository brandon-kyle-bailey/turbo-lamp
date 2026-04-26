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
import { MeetingGroup } from './meeting-group.entity';

export enum MeetingGroupVersionStatus {
  ACTIVE = 'active',
  FINALIZED = 'finalized',
  CANCELLED = 'cancelled',
}

@Entity('meeting_group_versions')
@Index(['meetingGroupId', 'version'], { unique: true })
export class MeetingGroupVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  meetingGroupId: string;

  @ManyToOne(() => MeetingGroup, (mg) => mg.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meetingGroupId' })
  meetingGroup: MeetingGroup;

  @Column()
  version: number;

  @Column({
    type: 'enum',
    enum: MeetingGroupVersionStatus,
    default: MeetingGroupVersionStatus.ACTIVE,
  })
  status: MeetingGroupVersionStatus;

  @Column({ type: 'timestamptz' })
  after: Date;

  @Column({ type: 'timestamptz' })
  before: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column()
  timezone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  computedSlots: Array<{ start: string; end: string; rank: number }>;

  @Column({ type: 'timestamptz', nullable: true })
  slotsComputedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MeetingGroup } from '../../meeting-groups/entities/meeting-group.entity';

@Entity('meeting_slots')
export class MeetingSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  meetingGroupId: string;

  @ManyToOne(() => MeetingGroup, (meetingGroup) => meetingGroup.slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meetingGroupId' })
  meetingGroup: MeetingGroup;

  @Column()
  start_at: Date;

  @Column()
  end_at: Date;

  @Column()
  rank: number;

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

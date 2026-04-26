import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OutboxEventType {
  MEETING_CREATED = 'meeting.created',
  MEETING_CANCELLED = 'meeting.cancelled',
  PARTICIPANT_INVITED = 'participant.invited',
  PARTICIPANT_ACCEPTED = 'participant.accepted',
  PARTICIPANT_DECLINED = 'participant.declined',
  AVAILABILITY_UPDATED = 'availability.updated',
  CALENDAR_SYNC_COMPLETED = 'calendar.sync.completed',
  EXTERNAL_EVENT_CREATED = 'external_event.created',
}

export enum OutboxEventStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DEAD_LETTER = 'dead_letter',
}

@Entity('outbox_events')
@Index(['status', 'createdAt'])
@Index(['type'])
export class OutboxEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OutboxEventType })
  type: OutboxEventType;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'int', default: 5 })
  maxRetries: number;

  @Column({
    type: 'enum',
    enum: OutboxEventStatus,
    default: OutboxEventStatus.PENDING,
  })
  status: OutboxEventStatus;

  @Column({ nullable: true })
  lastError: string;

  @Column({ type: 'timestamptz', nullable: true })
  processedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  correlationId: string;

  @Column({ nullable: true })
  causedBy: string;
}

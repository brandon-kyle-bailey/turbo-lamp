import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OutboxEvent,
  OutboxEventType,
  OutboxEventStatus,
} from './entities/outbox-event.entity';

export interface PublishEventOptions {
  type: OutboxEventType;
  payload: Record<string, any>;
  correlationId?: string;
  causedBy?: string;
}

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(
    @InjectRepository(OutboxEvent)
    private readonly repository: Repository<OutboxEvent>,
  ) {}

  async publish(options: PublishEventOptions): Promise<OutboxEvent> {
    const event = this.repository.create({
      type: options.type,
      payload: options.payload,
      correlationId: options.correlationId,
      causedBy: options.causedBy,
      status: OutboxEventStatus.PENDING,
      retryCount: 0,
      maxRetries: 5,
    });

    const saved = await this.repository.save(event);
    this.logger.log(`Published event ${saved.id} of type ${options.type}`);
    return saved;
  }

  async publishMeetingCreated(
    meetingId: string,
    meetingGroupId: string,
    creatorId: string,
    causedBy?: string,
  ): Promise<OutboxEvent> {
    return this.publish({
      type: OutboxEventType.MEETING_CREATED,
      payload: {
        meetingId,
        meetingGroupId,
        creatorId,
        timestamp: new Date().toISOString(),
      },
      correlationId: meetingId,
      causedBy,
    });
  }

  async publishParticipantStateChanged(
    participantId: string,
    meetingGroupId: string,
    newState: 'accepted' | 'declined',
    causedBy?: string,
  ): Promise<OutboxEvent> {
    const eventType =
      newState === 'accepted'
        ? OutboxEventType.PARTICIPANT_ACCEPTED
        : OutboxEventType.PARTICIPANT_DECLINED;

    return this.publish({
      type: eventType,
      payload: {
        participantId,
        meetingGroupId,
        state: newState,
        timestamp: new Date().toISOString(),
      },
      correlationId: meetingGroupId,
      causedBy,
    });
  }

  async getPendingEvents(limit: number = 100): Promise<OutboxEvent[]> {
    return this.repository.find({
      where: {
        status: OutboxEventStatus.PENDING,
      },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }

  async markProcessing(id: string): Promise<void> {
    await this.repository.update(id, {
      status: OutboxEventStatus.PROCESSING,
    });
  }

  async markCompleted(id: string): Promise<void> {
    await this.repository.update(id, {
      status: OutboxEventStatus.COMPLETED,
      processedAt: new Date(),
    });
  }

  async markFailed(id: string, error: string): Promise<void> {
    const event = await this.repository.findOne({ where: { id } });
    if (!event) return;

    if (event.retryCount >= event.maxRetries) {
      await this.repository.update(id, {
        status: OutboxEventStatus.DEAD_LETTER,
        lastError: error,
      });
      this.logger.error(
        `Event ${id} moved to dead letter after ${event.retryCount} retries`,
      );
    } else {
      await this.repository.update(id, {
        status: OutboxEventStatus.PENDING,
        retryCount: event.retryCount + 1,
        lastError: error,
      });
    }
  }

  async getEventStats(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    deadLetter: number;
  }> {
    const [pending, processing, completed, failed, deadLetter] =
      await Promise.all([
        this.repository.count({ where: { status: OutboxEventStatus.PENDING } }),
        this.repository.count({
          where: { status: OutboxEventStatus.PROCESSING },
        }),
        this.repository.count({
          where: { status: OutboxEventStatus.COMPLETED },
        }),
        this.repository.count({ where: { status: OutboxEventStatus.FAILED } }),
        this.repository.count({
          where: { status: OutboxEventStatus.DEAD_LETTER },
        }),
      ]);

    return { pending, processing, completed, failed, deadLetter };
  }
}

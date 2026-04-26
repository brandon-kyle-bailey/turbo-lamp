import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Job } from 'bullmq';
import { OutboxService, PublishEventOptions } from './outbox.service';
import { OutboxEventType } from './entities/outbox-event.entity';

@Injectable()
export class OutboxWorker implements OnModuleDestroy {
  private readonly logger = new Logger(OutboxWorker.name);

  constructor(
    @InjectQueue('outbox')
    private readonly outboxQueue: Queue,
    private readonly outboxService: OutboxService,
  ) {
    this.startWorker();
    this.logger.log('OutboxWorker initialized');
  }

  private startWorker(): void {
    this.logger.log('Worker started - events will be processed by BullMQ');
  }

  async processJob(
    job: Job<{
      eventId?: string;
      eventType?: string;
      payload?: PublishEventOptions;
    }>,
  ): Promise<void> {
    const { eventId, eventType, payload } = job.data;

    if (eventId) {
      await this.processEventById(eventId);
    } else if (eventType && payload) {
      await this.processEventByType(eventType, payload);
    } else {
      const events = await this.outboxService.getPendingEvents(10);

      for (const event of events) {
        try {
          await this.handleEvent(event);
          await this.outboxService.markCompleted(event.id);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          await this.outboxService.markFailed(event.id, errorMessage);
          this.logger.error(
            `Failed to process event ${event.id}: ${errorMessage}`,
          );
        }
      }
    }
  }

  private async processEventById(eventId: string): Promise<void> {
    await this.outboxService.markProcessing(eventId);

    const events = await this.outboxService.getPendingEvents(1);
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      this.logger.warn(`Event ${eventId} not found or already processed`);
      return;
    }

    try {
      await this.handleEvent(event);
      await this.outboxService.markCompleted(eventId);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      await this.outboxService.markFailed(eventId, errorMessage);
      throw error;
    }
  }

  private async processEventByType(
    eventType: string,
    payload: PublishEventOptions,
  ): Promise<void> {
    this.logger.log(`Processing event type: ${eventType}`);

    switch (eventType) {
      case OutboxEventType.MEETING_CREATED:
        await this.handleMeetingCreated(payload.payload);
        break;
      case OutboxEventType.MEETING_CANCELLED:
        await this.handleMeetingCancelled(payload.payload);
        break;
      case OutboxEventType.PARTICIPANT_INVITED:
        await this.handleParticipantInvited(payload.payload);
        break;
      case OutboxEventType.PARTICIPANT_ACCEPTED:
        await this.handleParticipantAccepted(payload.payload);
        break;
      case OutboxEventType.PARTICIPANT_DECLINED:
        await this.handleParticipantDeclined(payload.payload);
        break;
      case OutboxEventType.AVAILABILITY_UPDATED:
        await this.handleAvailabilityUpdated(payload.payload);
        break;
      case OutboxEventType.CALENDAR_SYNC_COMPLETED:
        await this.handleCalendarSyncCompleted(payload.payload);
        break;
      case OutboxEventType.EXTERNAL_EVENT_CREATED:
        await this.handleExternalEventCreated(payload.payload);
        break;
      default:
        this.logger.warn(`Unknown event type: ${eventType}`);
    }
  }

  private async handleEvent(event: any): Promise<void> {
    switch (event.type) {
      case OutboxEventType.MEETING_CREATED:
        await this.handleMeetingCreated(event.payload);
        break;
      case OutboxEventType.MEETING_CANCELLED:
        await this.handleMeetingCancelled(event.payload);
        break;
      case OutboxEventType.PARTICIPANT_INVITED:
        await this.handleParticipantInvited(event.payload);
        break;
      case OutboxEventType.PARTICIPANT_ACCEPTED:
        await this.handleParticipantAccepted(event.payload);
        break;
      case OutboxEventType.PARTICIPANT_DECLINED:
        await this.handleParticipantDeclined(event.payload);
        break;
      case OutboxEventType.AVAILABILITY_UPDATED:
        await this.handleAvailabilityUpdated(event.payload);
        break;
      case OutboxEventType.CALENDAR_SYNC_COMPLETED:
        await this.handleCalendarSyncCompleted(event.payload);
        break;
      case OutboxEventType.EXTERNAL_EVENT_CREATED:
        await this.handleExternalEventCreated(event.payload);
        break;
      default:
        this.logger.warn(`Unknown event type: ${event.type}`);
    }
  }

  private async handleMeetingCreated(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] Creating external calendar event for meeting ${payload.meetingId}`,
    );
  }

  private async handleMeetingCancelled(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] Cancelling external calendar event for meeting ${payload.meetingId}`,
    );
  }

  private async handleParticipantInvited(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] Sending invitation to participant for meeting group ${payload.meetingGroupId}`,
    );
  }

  private async handleParticipantAccepted(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] Participant ${payload.participantId} accepted invitation`,
    );
  }

  private async handleParticipantDeclined(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] Participant ${payload.participantId} declined invitation`,
    );
  }

  private async handleAvailabilityUpdated(payload: any): Promise<void> {
    this.logger.log(`[OUTBOX] Availability updated for user ${payload.userId}`);
  }

  private async handleCalendarSyncCompleted(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] Calendar sync completed for user ${payload.userId}`,
    );
  }

  private async handleExternalEventCreated(payload: any): Promise<void> {
    this.logger.log(
      `[OUTBOX] External event created: ${payload.externalEventId}`,
    );
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('OutboxWorker shutting down');
  }
}

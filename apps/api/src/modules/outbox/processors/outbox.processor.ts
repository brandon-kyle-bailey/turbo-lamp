import { Injectable, Logger } from '@nestjs/common';
import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OutboxService } from '../outbox.service';
import { OutboxEventType } from '../entities/outbox-event.entity';

@Processor('outbox')
@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);

  constructor(private readonly outboxService: OutboxService) {}

  async process(job: Job): Promise<void> {
    const eventId = job.data.eventId;
    this.logger.log(`Processing outbox event ${eventId}`);

    try {
      await this.outboxService.markProcessing(eventId);

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
    } catch (error) {
      this.logger.error(`Job failed: ${error}`);
      throw error;
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
      case OutboxEventType.PARTICIPANT_ACCEPTED:
      case OutboxEventType.PARTICIPANT_DECLINED:
        await this.handleParticipantStateChanged(event);
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
      `Creating external calendar event for meeting ${payload.meetingId}`,
    );
  }

  private async handleMeetingCancelled(payload: any): Promise<void> {
    this.logger.log(
      `Cancelling external calendar event for meeting ${payload.meetingId}`,
    );
  }

  private async handleParticipantStateChanged(event: any): Promise<void> {
    this.logger.log(
      `Participant state changed: ${event.type} for ${event.payload.participantId}`,
    );
  }

  private async handleExternalEventCreated(payload: any): Promise<void> {
    this.logger.log(`External event created: ${payload.eventId}`);
  }
}

import { Controller, Get } from '@nestjs/common';
import { OutboxService } from './outbox.service';

@Controller('api/core/outbox')
export class OutboxController {
  constructor(private readonly outboxService: OutboxService) {}

  @Get('stats')
  async getStats() {
    return this.outboxService.getEventStats();
  }
}

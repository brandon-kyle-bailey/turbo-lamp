import { Controller, Get } from '@nestjs/common';
import { OutboxService } from './outbox.service';

@Controller({ path: 'outbox', version: '1' })
export class OutboxController {
  constructor(private readonly outboxService: OutboxService) {}

  @Get('stats')
  async getStats() {
    return this.outboxService.getEventStats();
  }
}

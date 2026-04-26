import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { OutboxController } from './outbox.controller';
import { OutboxService } from './outbox.service';
import { OutboxWorker } from './outbox.worker';
import { OutboxEvent } from './entities/outbox-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxEvent]),
    BullModule.registerQueue({ name: 'outbox' }),
  ],
  controllers: [OutboxController],
  providers: [OutboxService, OutboxWorker],
  exports: [OutboxService],
})
export class OutboxModule {}

import { Module } from '@nestjs/common';
import { SlotEngineController } from './slot-engine.controller';
import { SlotEngineService } from './slot-engine.service';

@Module({
  controllers: [SlotEngineController],
  providers: [SlotEngineService],
  exports: [SlotEngineService],
})
export class SlotEngineModule {}

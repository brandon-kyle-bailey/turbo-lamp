import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SlotEngineService } from './slot-engine.service';
import {
  CalculateSlotsDto,
  CalculateSlotsResponseDto,
} from './dto/calculate-slots.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller({ path: 'meeting-slots', version: '1' })
@UseGuards(JwtAuthGuard)
export class SlotEngineController {
  constructor(private readonly slotEngineService: SlotEngineService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculate(
    @Body() dto: CalculateSlotsDto,
  ): Promise<CalculateSlotsResponseDto> {
    return this.slotEngineService.calculate(dto);
  }
}

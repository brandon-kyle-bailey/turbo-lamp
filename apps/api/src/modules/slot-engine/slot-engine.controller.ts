import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SlotEngineService } from './slot-engine.service';
import {
  CalculateSlotsDto,
  CalculateSlotsResponseDto,
} from './dto/calculate-slots.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('api/core/meeting-slots')
@UseGuards(JwtAuthGuard)
export class SlotEngineController {
  constructor(private readonly slotEngineService: SlotEngineService) {}

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculate(
    @Body() dto: CalculateSlotsDto,
    @Headers('x-slot-engine-version') version?: string,
  ): Promise<CalculateSlotsResponseDto> {
    return this.slotEngineService.calculate(dto);
  }
}

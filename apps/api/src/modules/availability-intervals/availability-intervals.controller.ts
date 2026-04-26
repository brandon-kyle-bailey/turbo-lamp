import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AvailabilityIntervalsService } from './availability-intervals.service';
import {
  CreateAvailabilityIntervalDto,
  UpdateAvailabilityIntervalDto,
  ExpandIntervalsDto,
  AvailabilityIntervalResponseDto,
  ExpandedIntervalResponseDto,
} from './dto/availability-interval.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller({ path: 'availability-intervals', version: '1' })
@UseGuards(JwtAuthGuard)
export class AvailabilityIntervalsController {
  constructor(
    private readonly availabilityIntervalsService: AvailabilityIntervalsService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAvailabilityIntervalDto,
  ): Promise<AvailabilityIntervalResponseDto> {
    const entity = await this.availabilityIntervalsService.create(dto);
    return this.toResponse(entity);
  }

  @Post('upsert')
  async upsert(
    @Body() dto: CreateAvailabilityIntervalDto,
  ): Promise<AvailabilityIntervalResponseDto> {
    const entity = await this.availabilityIntervalsService.upsert(dto);
    return this.toResponse(entity);
  }

  @Post('bulk')
  async bulkCreate(
    @Body() dto: CreateAvailabilityIntervalDto[],
  ): Promise<AvailabilityIntervalResponseDto[]> {
    const entities = await this.availabilityIntervalsService.bulkCreate(dto);
    return entities.map(this.toResponse);
  }

  @Get()
  async findAll(
    @Query('userId') userId: string,
  ): Promise<AvailabilityIntervalResponseDto[]> {
    const entities =
      await this.availabilityIntervalsService.findAllByUser(userId);
    return entities.map(this.toResponse);
  }

  @Get('expand')
  async expand(
    @Query('userId') userId: string,
    @Body() dto: ExpandIntervalsDto,
  ): Promise<ExpandedIntervalResponseDto[]> {
    const expanded = await this.availabilityIntervalsService.expandToDateRange(
      userId,
      new Date(dto.startDate),
      new Date(dto.endDate),
    );
    return expanded.map((e) => ({
      start: e.start.toISOString(),
      end: e.end.toISOString(),
      precedence: e.precedence,
      provenance: e.provenance,
      isBlocked: e.isBlocked,
    }));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<AvailabilityIntervalResponseDto> {
    const entity = await this.availabilityIntervalsService.findOne(id);
    return this.toResponse(entity);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityIntervalDto,
  ): Promise<AvailabilityIntervalResponseDto> {
    const entity = await this.availabilityIntervalsService.update(id, dto);
    return this.toResponse(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.availabilityIntervalsService.remove(id);
  }

  private toResponse(entity: any): AvailabilityIntervalResponseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      start: entity.start.toISOString(),
      end: entity.end.toISOString(),
      precedence: entity.precedence,
      provenance: entity.provenance,
      isBlocked: entity.isBlocked,
      recurrence: entity.recurrence,
      recurrenceDays: entity.recurrenceDays,
      externalSourceId: entity.externalSourceId,
      lastSyncedAt: entity.lastSyncedAt?.toISOString() ?? null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

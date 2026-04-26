import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  AvailabilityInterval,
  IntervalRecurrenceType,
} from './entities/availability-interval.entity';
import {
  CreateAvailabilityIntervalDto,
  UpdateAvailabilityIntervalDto,
} from './dto/availability-interval.dto';

@Injectable()
export class AvailabilityIntervalsService {
  constructor(
    @InjectRepository(AvailabilityInterval)
    private readonly repository: Repository<AvailabilityInterval>,
  ) {}

  async create(
    dto: CreateAvailabilityIntervalDto,
    actorId?: string,
  ): Promise<AvailabilityInterval> {
    const entity = this.repository.create({
      ...dto,
      start: new Date(dto.start),
      end: new Date(dto.end),
      createdBy: actorId,
    });
    return this.repository.save(entity);
  }

  async upsert(
    dto: CreateAvailabilityIntervalDto,
    actorId?: string,
  ): Promise<AvailabilityInterval> {
    const existing = await this.repository.findOne({
      where: {
        userId: dto.userId,
        start: new Date(dto.start),
        end: new Date(dto.end),
      } as FindOptionsWhere<AvailabilityInterval>,
    });

    if (existing) {
      await this.repository.update(existing.id, {
        ...dto,
        start: new Date(dto.start),
        end: new Date(dto.end),
        updatedBy: actorId,
      });
      return this.findOne(existing.id);
    }

    return this.create(dto, actorId);
  }

  async findAllByUser(
    userId: string,
    options?: { includeDeleted?: boolean },
  ): Promise<AvailabilityInterval[]> {
    const qb = this.repository
      .createQueryBuilder('interval')
      .where('interval.userId = :userId', { userId });

    if (!options?.includeDeleted) {
      qb.andWhere('interval.deletedAt IS NULL');
    }

    return qb.orderBy('interval.precedence', 'DESC').getMany();
  }

  async findOne(id: string): Promise<AvailabilityInterval> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException();
    return entity;
  }

  async update(
    id: string,
    dto: UpdateAvailabilityIntervalDto,
    actorId?: string,
  ): Promise<AvailabilityInterval> {
    await this.repository.update(id, {
      ...dto,
      start: dto.start ? new Date(dto.start) : undefined,
      end: dto.end ? new Date(dto.end) : undefined,
      updatedBy: actorId,
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.softDelete(entity.id);
  }

  async expandToDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{
      start: Date;
      end: Date;
      precedence: number;
      provenance: string;
      isBlocked: boolean;
    }>
  > {
    const intervals = await this.repository.find({
      where: { userId } as any,
    });

    const nonRecurring = intervals.filter(
      (i) => i.recurrence === IntervalRecurrenceType.NONE,
    );

    const weekly = intervals.filter(
      (i) => i.recurrence === IntervalRecurrenceType.WEEKLY,
    );

    const expanded: Array<{
      start: Date;
      end: Date;
      precedence: number;
      provenance: string;
      isBlocked: boolean;
    }> = [];

    for (const interval of nonRecurring) {
      if (interval.start >= startDate && interval.start <= endDate) {
        expanded.push({
          start: interval.start,
          end: interval.end,
          precedence: interval.precedence,
          provenance: interval.provenance,
          isBlocked: interval.isBlocked,
        });
      }
    }

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      const dateStr = d.toISOString().split('T')[0];

      for (const weeklyInterval of weekly) {
        if (!weeklyInterval.recurrenceDays?.includes(dayOfWeek)) continue;

        const startTime = weeklyInterval.start
          .toISOString()
          .split('T')[1]
          .substring(0, 5);
        const endTime = weeklyInterval.end
          .toISOString()
          .split('T')[1]
          .substring(0, 5);

        expanded.push({
          start: new Date(`${dateStr}T${startTime}:00.000Z`),
          end: new Date(`${dateStr}T${endTime}:00.000Z`),
          precedence: weeklyInterval.precedence,
          provenance: weeklyInterval.provenance,
          isBlocked: weeklyInterval.isBlocked,
        });
      }
    }

    expanded.sort((a, b) => b.precedence - a.precedence);

    const result: typeof expanded = [];
    for (const interval of expanded) {
      const conflict = result.some(
        (existing) =>
          interval.start < existing.end && interval.end > existing.start,
      );
      if (!conflict) {
        result.push(interval);
      }
    }

    return result;
  }

  async bulkCreate(
    intervals: CreateAvailabilityIntervalDto[],
    actorId?: string,
  ): Promise<AvailabilityInterval[]> {
    const entities = intervals.map((dto) =>
      this.repository.create({
        ...dto,
        start: new Date(dto.start),
        end: new Date(dto.end),
        createdBy: actorId,
      }),
    );
    return this.repository.save(entities);
  }
}

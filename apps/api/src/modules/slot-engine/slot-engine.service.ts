import { Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import {
  Slot,
  SlotEngineOutput,
  ParticipantAvailability,
  MeetingGroupConstraints,
  TimeInterval,
  SlotEngineInput,
  computeSlots,
  validateSlotEngineInvariants,
} from './domain/interval.types';
import {
  CalculateSlotsDto,
  CalculateSlotsResponseDto,
  SlotOutputDto,
} from './dto/calculate-slots.dto';

@Injectable()
export class SlotEngineService {
  private readonly logger = new Logger(SlotEngineService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async calculate(dto: CalculateSlotsDto): Promise<CalculateSlotsResponseDto> {
    const constraints: MeetingGroupConstraints = {
      after: new Date(dto.meetingGroup.after),
      before: new Date(dto.meetingGroup.before),
      duration: dto.meetingGroup.duration,
      timezone: dto.meetingGroup.timezone,
    };

    const participants: ParticipantAvailability[] = dto.participants.map(
      (p) => ({
        userId: p.userId,
        isRequired: Boolean(p.isRequired),
        intervals: p.intervals.map((i) => ({
          start: new Date(i.start),
          end: new Date(i.end),
        })),
      }),
    );

    const blockedIntervals: TimeInterval[] =
      dto.blockedIntervals?.map((i) => ({
        start: new Date(i.start),
        end: new Date(i.end),
      })) ?? [];

    const cacheKey = this.generateCacheKey(constraints, participants);

    let result: SlotEngineOutput | null = null;
    let cacheHit = false;

    try {
      const cached = await this.cacheManager.get<string>(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        result = {
          ...parsed,
          computedAt: new Date(parsed.computedAt),
        };
        cacheHit = true;
      }
    } catch (error) {
      this.logger.warn(`Cache read failed: ${error}`);
      cacheHit = false;
    }

    if (!result) {
      const input: SlotEngineInput = {
        constraints,
        participants,
        blockedIntervals,
      };

      result = computeSlots(input);

      const validation = validateSlotEngineInvariants(result, input);
      if (!validation.valid) {
        throw new Error(
          `Slot engine invariant violation: ${validation.errors.join(', ')}`,
        );
      }

      try {
        await this.cacheManager.set(cacheKey, JSON.stringify(result), 300000);
      } catch (error) {
        this.logger.warn(`Cache write failed: ${error}`);
      }
    }

    const maxSlots = dto.maxSlots ?? 50;
    const slots: SlotOutputDto[] = result.slots.slice(0, maxSlots).map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
      rank: s.rank,
    }));

    return {
      data: slots,
      meta: {
        computedAt: result.computedAt.toISOString(),
        engineVersion: result.engineVersion,
        cacheHit,
      },
    };
  }

  private generateCacheKey(
    constraints: MeetingGroupConstraints,
    participants: ParticipantAvailability[],
  ): string {
    const keyParts = [
      constraints.after.toISOString(),
      constraints.before.toISOString(),
      constraints.duration.toString(),
      constraints.timezone,
      participants
        .map((p) =>
          [
            p.userId,
            p.isRequired ? '1' : '0',
            p.intervals
              .map((i) => `${i.start.getTime()}-${i.end.getTime()}`)
              .join(','),
          ].join(':'),
        )
        .sort()
        .join('|'),
    ];
    return `slots:${Buffer.from(keyParts.join('::')).toString('base64')}`;
  }

  async invalidateCache(_userId: string): Promise<void> {
    this.logger.warn(
      'Cache invalidation called but not implemented in this adapter',
    );
  }
}

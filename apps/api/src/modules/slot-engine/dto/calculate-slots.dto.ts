import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ParticipantInputDto {
  @IsString()
  userId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntervalInputDto)
  intervals!: IntervalInputDto[];

  @IsNumber()
  isRequired!: number;
}

export class IntervalInputDto {
  @IsDateString()
  start!: string;

  @IsDateString()
  end!: string;
}

export class MeetingGroupConstraintsDto {
  @IsDateString()
  after!: string;

  @IsDateString()
  before!: string;

  @IsNumber()
  @Min(1)
  duration!: number;

  @IsString()
  timezone!: string;
}

export class CalculateSlotsDto {
  @ValidateNested()
  @Type(() => MeetingGroupConstraintsDto)
  meetingGroup!: MeetingGroupConstraintsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantInputDto)
  participants!: ParticipantInputDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IntervalInputDto)
  blockedIntervals?: IntervalInputDto[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  maxSlots?: number;
}

export class SlotOutputDto {
  start!: string;
  end!: string;
  rank!: number;
}

export class CalculateSlotsResponseDto {
  data!: SlotOutputDto[];
  meta!: {
    computedAt: string;
    engineVersion: string;
    cacheHit: boolean;
  };
}

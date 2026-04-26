import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export enum AvailabilityProvenance {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export enum IntervalRecurrenceType {
  NONE = 'none',
  WEEKLY = 'weekly',
}

export class CreateAvailabilityIntervalDto {
  @IsUUID()
  userId!: string;

  @IsDateString()
  start!: string;

  @IsDateString()
  end!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  precedence?: number;

  @IsOptional()
  @IsEnum(AvailabilityProvenance)
  provenance?: AvailabilityProvenance;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsEnum(IntervalRecurrenceType)
  recurrence?: IntervalRecurrenceType;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  recurrenceDays?: number[];

  @IsOptional()
  @IsString()
  externalSourceId?: string;
}

export class UpdateAvailabilityIntervalDto {
  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  precedence?: number;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsEnum(IntervalRecurrenceType)
  recurrence?: IntervalRecurrenceType;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  recurrenceDays?: number[];
}

export class ExpandIntervalsDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  maxDays?: number;
}

export class AvailabilityIntervalResponseDto {
  id!: string;
  userId!: string;
  start!: string;
  end!: string;
  precedence!: number;
  provenance!: string;
  isBlocked!: boolean;
  recurrence!: string;
  recurrenceDays!: number[] | null;
  externalSourceId!: string | null;
  lastSyncedAt!: string | null;
  createdAt!: string;
  updatedAt!: string;
}

export class ExpandedIntervalResponseDto {
  start!: string;
  end!: string;
  precedence!: number;
  provenance!: string;
  isBlocked!: boolean;
}

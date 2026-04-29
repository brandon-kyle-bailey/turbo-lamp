import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUUID,
} from 'class-validator';
import { CalendarProvider } from '../../../libs/constants';

export class CreateCalendarDto {
  @ApiProperty({
    description: 'The ID of the calendar provider',
    enum: CalendarProvider,
    enumName: 'CalendarProvider',
  })
  @IsEnum(CalendarProvider)
  providerId: CalendarProvider;

  @ApiProperty({ description: 'The external ID of the calendar' })
  @IsString()
  externalId: string;

  @IsOptional()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The name of the calendar' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The timezone of the calendar',
    default: 'America/Halifax',
  })
  @IsTimeZone()
  timezone: string;

  @ApiProperty({
    description: 'Whether the calendar is enabled or not',
    default: true,
  })
  @IsBoolean()
  enabled: boolean;
}

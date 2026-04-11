import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsTimeZone, IsUUID } from 'class-validator';
import { CalendarProvider } from '../../../lib/constants';

export class CreateCalendarDto {
  @ApiProperty({ description: 'The ID of the calendar provider' })
  @IsEnum(CalendarProvider)
  providerId: CalendarProvider;
  @ApiProperty({ description: 'The ID of the calendar' })
  @IsString()
  calendarId: string;

  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The timezone of the calendar' })
  @IsTimeZone()
  timezone: string;
}

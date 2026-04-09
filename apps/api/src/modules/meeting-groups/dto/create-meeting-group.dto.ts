import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MeetingGroupStatus } from '../../../lib/constants';

export class CreateMeetingGroupDto {
  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @ApiProperty({ description: 'The title of the meeting group.' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The duration of the meeting group.' })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'The after date of the meeting group.' })
  @IsDateString()
  after: string;

  @ApiProperty({ description: 'The before date of the meeting group.' })
  @IsDateString()
  before: string;

  @ApiProperty({ description: 'The timezone of the meeting group.' })
  @IsString()
  timezone: string;

  @ApiProperty({ description: 'The status of the meeting group.' })
  @IsEnum(MeetingGroupStatus)
  status: MeetingGroupStatus;
}

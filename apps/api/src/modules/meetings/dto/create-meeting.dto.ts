import { ApiProperty } from '@nestjs/swagger';
import { MeetingStatus } from '../../../lib/constants';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({ description: 'The ID of the meeting group.' })
  @IsUUID()
  meetingGroupId: string;

  @ApiProperty({ description: 'the meetings start time.' })
  @IsDateString()
  start_at: Date;

  @ApiProperty({ description: 'the meetings end time.' })
  @IsDateString()
  end_at: Date;

  @ApiProperty({ description: 'the meetings status.' })
  @IsEnum(MeetingStatus)
  status: MeetingStatus;
}

import { ApiProperty } from '@nestjs/swagger';
import { MeetingStatus } from '../../../lib/constants';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty({ description: 'The ID of the meeting group.' })
  @IsUUID()
  meetingGroupId: string;

  @ApiProperty({
    description: 'the meetings start time.',
    default: new Date().toUTCString(),
  })
  @IsDateString()
  start: Date;

  @ApiProperty({
    description: 'the meetings end time.',
    default: new Date().toUTCString(),
  })
  @IsDateString()
  end: Date;

  @ApiProperty({
    description: 'the meetings status.',
    enum: MeetingStatus,
    enumName: 'MeetingStatus',
  })
  @IsEnum(MeetingStatus)
  status: MeetingStatus;
}

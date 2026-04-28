import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateMeetingSlotDto {
  @ApiProperty({ description: 'The ID of the meeting group.' })
  @IsUUID()
  meetingGroupId: string;

  @ApiProperty({
    description: 'the meeting slots start time.',
    default: new Date().toUTCString(),
  })
  @IsDateString()
  start: Date;

  @ApiProperty({
    description: 'the meeting slots end time.',
    default: new Date().toUTCString(),
  })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the meeting slots rank.' })
  @IsNumber()
  rank: number;
}

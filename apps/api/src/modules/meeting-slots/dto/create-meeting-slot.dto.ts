import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsUUID } from 'class-validator';

export class CreateMeetingSlotDto {
  @ApiProperty({ description: 'The ID of the meeting group.' })
  @IsUUID()
  meetingGroupId: string;

  @ApiProperty({ description: 'the meeting slots start time.' })
  @IsDateString()
  start_at: Date;

  @ApiProperty({ description: 'the meeting slots end time.' })
  @IsDateString()
  end_at: Date;

  @ApiProperty({ description: 'the meeting slots rank.' })
  @IsNumber()
  rank: number;
}

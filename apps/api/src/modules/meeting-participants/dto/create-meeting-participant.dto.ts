import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateMeetingParticipantDto {
  @ApiProperty({ description: 'ID of the meeting group' })
  @IsUUID()
  meetingGroupId: string;

  @ApiProperty({ description: 'Email address of the participant' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'ID of the user' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'If the participant is required.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;
}

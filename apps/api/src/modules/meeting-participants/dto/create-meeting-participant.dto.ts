import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import {
  ParticipantAuthState,
  ParticipantInvitationState,
} from '../../../libs/constants';

export class CreateMeetingParticipantDto {
  @ApiProperty({ description: 'ID of the meeting group' })
  @IsUUID()
  meetingGroupId: string;

  @ApiPropertyOptional({ description: 'Email address of the participant' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'ID of the user' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'If the participant is required.',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({
    description: 'If the participant has authenticated.',
    enum: ParticipantAuthState,
  })
  @IsOptional()
  @IsEnum(ParticipantAuthState)
  authState?: ParticipantAuthState;

  @ApiPropertyOptional({
    description: 'Invitation state of the participant.',
    enum: ParticipantInvitationState,
  })
  @IsOptional()
  @IsEnum(ParticipantInvitationState)
  invitationState?: ParticipantInvitationState;
}

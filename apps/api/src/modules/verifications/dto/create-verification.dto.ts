import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateVerificationDto {
  @ApiProperty({ description: 'Identifier of the verification' })
  @IsString()
  identifier: string;

  @ApiProperty({ description: 'Value of the verification' })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Expiration of the validation',
    default: new Date().toUTCString(),
  })
  @IsDateString()
  expiresAt: Date;
}

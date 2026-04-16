import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ description: 'The ID of the user.' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The sessions token.' })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'The sessions expiration.',
    default: new Date().toISOString(),
  })
  @IsDateString()
  expiresAt: Date;

  @ApiProperty({ description: 'The IP address of the client.' })
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @ApiProperty({ description: 'The user agent of the client.' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

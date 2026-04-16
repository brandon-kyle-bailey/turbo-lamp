import {
  IsDateString,
  IsIP,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  userId: string;

  @IsString()
  token: string;

  @IsDateString()
  expiresAt: Date;

  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

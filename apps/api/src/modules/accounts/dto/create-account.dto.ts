import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AccountProvider } from '../../../libs/constants';

export class CreateAccountDto {
  @ApiProperty({ description: 'The ID of the user.' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The account identifier from the provider.' })
  @IsString()
  accountId: string;

  @ApiProperty({ description: 'The provider type.', enum: AccountProvider })
  @IsEnum(AccountProvider)
  providerId: AccountProvider;

  @ApiProperty({ description: 'The OAuth access token.', required: false })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiProperty({ description: 'The OAuth refresh token.', required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiProperty({ description: 'Access token expiration.', required: false })
  @IsOptional()
  @IsDateString()
  accessTokenExpiresAt?: Date;

  @ApiProperty({ description: 'Refresh token expiration.', required: false })
  @IsOptional()
  @IsDateString()
  refreshTokenExpiresAt?: Date;

  @ApiProperty({ description: 'OAuth scope.', required: false })
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiProperty({ description: 'ID token (OIDC).', required: false })
  @IsOptional()
  @IsString()
  idToken?: string;

  @ApiProperty({
    description: 'Password for credential auth.',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;
}

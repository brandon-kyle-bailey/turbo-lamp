import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { AccountProvider } from '../../../lib/constants';

export class CreateCalendarDto {
  userId?: string;

  @ApiProperty({
    description: 'Calendar Connection provider',
    default: AccountProvider.GOOGLE,
  })
  @IsEnum(AccountProvider)
  provider: AccountProvider.GOOGLE;

  @IsString()
  calendarId: string;
}

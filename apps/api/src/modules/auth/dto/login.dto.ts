import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The users email address.' })
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'The users password.' })
  @IsStrongPassword()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'The day of the week for the availability. E.g 0-6',
    default: 0,
  })
  @IsNumber()
  dayOfWeek: number;

  @ApiProperty({
    description: 'The start time of the availability period.',
    default: new Date().toISOString().split('T')[1].split('.')[0],
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'The end time of the availability period.',
    default: new Date().toISOString().split('T')[1].split('.')[0],
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: "Weather you're available or not.",
    default: true,
  })
  @IsBoolean()
  isAvailable: boolean;
}

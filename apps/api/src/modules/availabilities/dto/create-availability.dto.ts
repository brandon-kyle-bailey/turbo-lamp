import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNumber } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'The day of the week for the availability. E.g 0-6',
    default: 0,
  })
  @IsNumber()
  dayOfWeek: number;

  @ApiProperty({
    description: 'The start time of the availability period.',
    default: new Date(),
  })
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'The end time of the availability period.',
    default: new Date(),
  })
  @IsDate()
  endTime: Date;

  @ApiProperty({
    description: 'Weather the availbility is enabled.',
    default: new Date(),
  })
  @IsBoolean()
  isEnabled: boolean;
}

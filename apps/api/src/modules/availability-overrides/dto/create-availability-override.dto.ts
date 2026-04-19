import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString } from 'class-validator';

export class CreateAvailabilityOverrideDto {
  @ApiProperty({
    description: 'The date of the override.',
    default: new Date(),
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    description: 'The start time of the override.',
    default: new Date(),
  })
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    description: 'The end time of the override.',
    default: new Date(),
  })
  @IsDateString()
  endTime: Date;

  @ApiProperty({
    description:
      'Whether the override represnet availability or unavailability.',
    default: false,
  })
  @IsBoolean()
  isAvailable: boolean;
}

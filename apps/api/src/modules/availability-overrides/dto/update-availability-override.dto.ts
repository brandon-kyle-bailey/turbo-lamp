import { PartialType } from '@nestjs/swagger';
import { CreateAvailabilityOverrideDto } from './create-availability-override.dto';

export class UpdateAvailabilityOverrideDto extends PartialType(
  CreateAvailabilityOverrideDto,
) {}

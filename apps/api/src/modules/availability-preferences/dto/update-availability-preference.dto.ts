import { PartialType } from '@nestjs/swagger';
import { CreateAvailabilityPreferenceDto } from './create-availability-preference.dto';

export class UpdateAvailabilityPreferenceDto extends PartialType(CreateAvailabilityPreferenceDto) {}

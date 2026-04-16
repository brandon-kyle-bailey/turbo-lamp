import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityPreferencesService } from './availability-preferences.service';

describe('AvailabilityPreferencesService', () => {
  let service: AvailabilityPreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilityPreferencesService],
    }).compile();

    service = module.get<AvailabilityPreferencesService>(AvailabilityPreferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

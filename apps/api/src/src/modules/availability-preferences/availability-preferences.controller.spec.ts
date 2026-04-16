import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityPreferencesController } from './availability-preferences.controller';
import { AvailabilityPreferencesService } from './availability-preferences.service';

describe('AvailabilityPreferencesController', () => {
  let controller: AvailabilityPreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityPreferencesController],
      providers: [AvailabilityPreferencesService],
    }).compile();

    controller = module.get<AvailabilityPreferencesController>(AvailabilityPreferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

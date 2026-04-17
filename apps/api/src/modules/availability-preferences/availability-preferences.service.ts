import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvailabilityPreferenceDto } from './dto/create-availability-preference.dto';
import { UpdateAvailabilityPreferenceDto } from './dto/update-availability-preference.dto';
import { AvailabilityPreference } from './entities/availability-preference.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';

@Injectable()
export class AvailabilityPreferencesService {
  constructor(
    @InjectRepository(AvailabilityPreference)
    private readonly repository: Repository<AvailabilityPreference>,
  ) {}
  async create(
    createAvailabilityPreferenceDto: CreateAvailabilityPreferenceDto & {
      createdBy: string;
    },
  ) {
    return await this.repository.save(
      this.repository.create(createAvailabilityPreferenceDto),
    );
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where:
      | FindOptionsWhere<AvailabilityPreference>
      | FindOptionsWhere<AvailabilityPreference>[],
    relations?: FindOptionsRelations<AvailabilityPreference>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<AvailabilityPreference>,
  ) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where:
      | FindOptionsWhere<AvailabilityPreference>
      | FindOptionsWhere<AvailabilityPreference>[],
    relations?: FindOptionsRelations<AvailabilityPreference>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(
    id: string,
    updateAvailabilityPreferenceDto: UpdateAvailabilityPreferenceDto,
  ) {
    const result = await this.repository.update(id, {
      ...updateAvailabilityPreferenceDto,
    });
    if (!result.affected) {
      throw new NotFoundException();
    }
    return await this.findOne(id);
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meeting.id);
  }
}

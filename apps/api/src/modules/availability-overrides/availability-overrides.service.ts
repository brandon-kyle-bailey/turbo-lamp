import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvailabilityOverrideDto } from './dto/create-availability-override.dto';
import { UpdateAvailabilityOverrideDto } from './dto/update-availability-override.dto';
import { AvailabilityOverride } from './entities/availability-override.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';

@Injectable()
export class AvailabilityOverridesService {
  constructor(
    @InjectRepository(AvailabilityOverride)
    private readonly repository: Repository<AvailabilityOverride>,
  ) {}

  async upsert(
    createAvailabilityOverrideDto: CreateAvailabilityOverrideDto & {
      createdBy: string;
      userId: string;
    },
  ) {
    await this.repository.upsert(createAvailabilityOverrideDto, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['userId', 'date', 'startTime', 'endTime'],
    });
    return this.findOneBy({
      userId: createAvailabilityOverrideDto.userId,
      date: createAvailabilityOverrideDto.date,
      startTime: createAvailabilityOverrideDto.startTime,
      endTime: createAvailabilityOverrideDto.endTime,
    });
  }

  async create(
    createAvailabilityOverrideDto: CreateAvailabilityOverrideDto & {
      createdBy: string;
      userId: string;
    },
  ) {
    return await this.repository.save(
      this.repository.create(createAvailabilityOverrideDto),
    );
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where:
      | FindOptionsWhere<AvailabilityOverride>
      | FindOptionsWhere<AvailabilityOverride>[],
    relations?: FindOptionsRelations<AvailabilityOverride>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<AvailabilityOverride>,
  ) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where:
      | FindOptionsWhere<AvailabilityOverride>
      | FindOptionsWhere<AvailabilityOverride>[],
    relations?: FindOptionsRelations<AvailabilityOverride>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(
    id: string,
    updateAvailabilityOverrideDto: UpdateAvailabilityOverrideDto,
  ) {
    const result = await this.repository.update(id, {
      ...updateAvailabilityOverrideDto,
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

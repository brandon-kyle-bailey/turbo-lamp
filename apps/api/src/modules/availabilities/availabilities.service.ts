import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { Availability } from './entities/availability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, FindOptionsRelations } from 'typeorm';

@Injectable()
export class AvailabilitiesService {
  constructor(
    @InjectRepository(Availability)
    private readonly repository: Repository<Availability>,
  ) {}
  async create(
    createAvailabilityDto: CreateAvailabilityDto & {
      createdBy: string;
    },
  ) {
    return await this.repository.save(
      this.repository.create(createAvailabilityDto),
    );
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where: FindOptionsWhere<Availability> | FindOptionsWhere<Availability>[],
    relations?: FindOptionsRelations<Availability>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(id: string, relations?: FindOptionsRelations<Availability>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Availability> | FindOptionsWhere<Availability>[],
    relations?: FindOptionsRelations<Availability>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateAvailabilityDto: UpdateAvailabilityDto) {
    const result = await this.repository.update(id, {
      ...updateAvailabilityDto,
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

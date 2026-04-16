import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Calendar } from './entities/calendar.entity';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Calendar)
    private readonly repository: Repository<Calendar>,
  ) {}

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where: FindOptionsWhere<Calendar> | FindOptionsWhere<Calendar>[],
    relations?: FindOptionsRelations<Calendar>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(id: string, relations?: FindOptionsRelations<Calendar>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Calendar> | FindOptionsWhere<Calendar>[],
    relations?: FindOptionsRelations<Calendar>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async create(createCalendarDto: CreateCalendarDto) {
    return await this.repository.save(
      this.repository.create(createCalendarDto),
    );
  }

  async update(id: string, updateCalendarDto: UpdateCalendarDto) {
    const result = await this.repository.update(id, {
      ...updateCalendarDto,
    });
    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  async remove(id: string) {
    const calendar = await this.findOne(id);
    if (!calendar) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(calendar.id);
  }
}

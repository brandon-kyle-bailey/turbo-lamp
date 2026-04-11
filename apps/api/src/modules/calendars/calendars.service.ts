import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Calendar } from './entities/calendar.entity';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(Calendar)
    private readonly repository: Repository<Calendar>,
  ) {}
  async create(createCalendarDto: CreateCalendarDto) {
    const calendar = this.repository.create(createCalendarDto);
    return await this.repository.save(calendar);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations: (keyof Calendar)[] = []) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Calendar>,
    relations: (keyof Calendar)[] = [],
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateCalendarDto: UpdateCalendarDto) {
    const calendar = await this.findOne(id);
    return await this.repository.update(id, {
      ...calendar,
      ...updateCalendarDto,
    });
  }

  async remove(id: string) {
    const calendar = await this.findOne(id);
    if (!calendar) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(calendar.id);
  }
}

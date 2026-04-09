import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CalendarConnection } from './entities/calendar-connection.entity';
import { CreateCalendarDto } from './dtos/create-calendar.dto';
import { UpdateCalendarDto } from './dtos/update-calendar.dto';

@Injectable()
export class CalendarsService {
  constructor(
    @InjectRepository(CalendarConnection)
    private readonly repository: Repository<CalendarConnection>,
  ) {}
  async create(createCalendarDto: CreateCalendarDto) {
    const calendar = this.repository.create(createCalendarDto);
    return await this.repository.save(calendar);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations: (keyof CalendarConnection)[] = []) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<CalendarConnection>,
    relations: (keyof CalendarConnection)[],
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly repository: Repository<Meeting>,
  ) {}
  async create(createMeetingDto: CreateMeetingDto) {
    const meeting = this.repository.create(createMeetingDto);
    return await this.repository.save(meeting);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations?: FindOptionsRelations<Meeting>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Meeting>,
    relations?: FindOptionsRelations<Meeting>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    const meeting = await this.findOne(id);
    return await this.repository.update(id, {
      ...meeting,
      ...updateMeetingDto,
    });
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meeting.id);
  }
}

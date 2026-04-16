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

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where?: FindOptionsWhere<Meeting>,
    relations?: FindOptionsRelations<Meeting>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
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

  async create(createMeetingDto: CreateMeetingDto) {
    return await this.repository.save(this.repository.create(createMeetingDto));
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {
    const result = await this.repository.update(id, {
      ...updateMeetingDto,
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

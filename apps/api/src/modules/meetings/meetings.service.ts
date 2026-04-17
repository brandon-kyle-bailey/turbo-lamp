import { Injectable, NotFoundException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';
import { MeetingCreatedEvent } from './events/meeting-created.event';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly repository: Repository<Meeting>,
    private eventBus: EventBus,
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
    const entity = this.repository.create(createMeetingDto);
    await this.repository.save(entity);
    await this.eventBus.publish(new MeetingCreatedEvent(entity));
    return entity;
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

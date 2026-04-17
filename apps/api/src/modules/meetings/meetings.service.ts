import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { CommandBus } from '@nestjs/cqrs';
import { MeetingCreatedCommand } from './commands/meeting-created.command';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private readonly repository: Repository<Meeting>,
    private commandBus: CommandBus,
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
    await this.commandBus.execute(new MeetingCreatedCommand(entity));
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

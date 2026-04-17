import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { MeetingGroup } from './entities/meeting-group.entity';

@Injectable()
export class MeetingGroupsService {
  constructor(
    @InjectRepository(MeetingGroup)
    private readonly repository: Repository<MeetingGroup>,
  ) {}

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where: FindOptionsWhere<MeetingGroup> | FindOptionsWhere<MeetingGroup>[],
    relations?: FindOptionsRelations<MeetingGroup>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(id: string, relations?: FindOptionsRelations<MeetingGroup>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingGroup> | FindOptionsWhere<MeetingGroup>[],
    relations?: FindOptionsRelations<MeetingGroup>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async create(
    createMeetingGroupDto: CreateMeetingGroupDto & { createdBy: string },
  ) {
    return await this.repository.save(
      this.repository.create(createMeetingGroupDto),
    );
  }

  async update(id: string, updateMeetingGroupDto: UpdateMeetingGroupDto) {
    const meetingGroup = await this.findOne(id);
    return await this.repository.update(id, {
      ...meetingGroup,
      ...updateMeetingGroupDto,
    });
  }

  async remove(id: string) {
    const meetingGroup = await this.findOne(id);
    if (!meetingGroup) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meetingGroup.id);
  }
}

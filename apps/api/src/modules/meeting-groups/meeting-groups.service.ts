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
  async create(createMeetingGroupDto: CreateMeetingGroupDto) {
    const meetingGroup = this.repository.create(createMeetingGroupDto);
    return await this.repository.save(meetingGroup);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations?: FindOptionsRelations<MeetingGroup>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingGroup>,
    relations?: FindOptionsRelations<MeetingGroup>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
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

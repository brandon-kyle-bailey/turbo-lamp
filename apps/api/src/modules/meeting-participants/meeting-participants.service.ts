import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MeetingParticipant } from './entities/meeting-participant.entity';

@Injectable()
export class MeetingParticipantsService {
  constructor(
    @InjectRepository(MeetingParticipant)
    private readonly repository: Repository<MeetingParticipant>,
  ) {}
  async create(createMeetingParticipantDto: CreateMeetingParticipantDto) {
    const meeting = this.repository.create(createMeetingParticipantDto);
    return await this.repository.save(meeting);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations: (keyof MeetingParticipant)[] = []) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingParticipant>,
    relations: (keyof MeetingParticipant)[] = [],
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(
    id: string,
    updateMeetingParticipantDto: UpdateMeetingParticipantDto,
  ) {
    const meeting = await this.findOne(id);
    return await this.repository.update(id, {
      ...meeting,
      ...updateMeetingParticipantDto,
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

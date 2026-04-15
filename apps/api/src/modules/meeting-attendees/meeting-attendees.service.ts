import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingAttendeeDto } from './dto/create-meeting-attendee.dto';
import { UpdateMeetingAttendeeDto } from './dto/update-meeting-attendee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { MeetingAttendee } from './entities/meeting-attendee.entity';

@Injectable()
export class MeetingAttendeesService {
  constructor(
    @InjectRepository(MeetingAttendee)
    private readonly repository: Repository<MeetingAttendee>,
  ) {}
  async create(createMeetingAttendeeDto: CreateMeetingAttendeeDto) {
    const meetingAttendee = this.repository.create(createMeetingAttendeeDto);
    return await this.repository.save(meetingAttendee);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations?: FindOptionsRelations<MeetingAttendee>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingAttendee>,
    relations?: FindOptionsRelations<MeetingAttendee>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateMeetingAttendeeDto: UpdateMeetingAttendeeDto) {
    const meetingAttendee = await this.findOne(id);
    return await this.repository.update(id, {
      ...meetingAttendee,
      ...updateMeetingAttendeeDto,
    });
  }

  async remove(id: string) {
    const meetingAttendee = await this.findOne(id);
    if (!meetingAttendee) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meetingAttendee.id);
  }
}

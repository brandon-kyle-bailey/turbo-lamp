import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMeetingSlotDto } from './dto/create-meeting-slot.dto';
import { UpdateMeetingSlotDto } from './dto/update-meeting-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MeetingSlot } from './entities/meeting-slot.entity';

@Injectable()
export class MeetingSlotsService {
  constructor(
    @InjectRepository(MeetingSlot)
    private readonly repository: Repository<MeetingSlot>,
  ) {}
  async create(createMeetingSlotDto: CreateMeetingSlotDto) {
    const meeting = this.repository.create(createMeetingSlotDto);
    return await this.repository.save(meeting);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations: (keyof MeetingSlot)[] = []) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingSlot>,
    relations: (keyof MeetingSlot)[] = [],
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateMeetingSlotDto: UpdateMeetingSlotDto) {
    const meeting = await this.findOne(id);
    return await this.repository.update(id, {
      ...meeting,
      ...updateMeetingSlotDto,
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

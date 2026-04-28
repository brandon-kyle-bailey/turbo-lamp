import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMeetingGroupDto } from './dto/create-meeting-group.dto';
import { UpdateMeetingGroupDto } from './dto/update-meeting-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { MeetingGroup } from './entities/meeting-group.entity';
import { MeetingGroupStatus } from '../../lib/constants';

const ALLOWED_STATUS_TRANSITIONS: Record<
  MeetingGroupStatus,
  MeetingGroupStatus[]
> = {
  [MeetingGroupStatus.OPEN]: [MeetingGroupStatus.FINALIZED],
  [MeetingGroupStatus.FINALIZED]: [MeetingGroupStatus.CANCELLED],
  [MeetingGroupStatus.CANCELLED]: [],
};

@Injectable()
export class MeetingGroupsService {
  constructor(
    @InjectRepository(MeetingGroup)
    private readonly repository: Repository<MeetingGroup>,
  ) {}

  private validateStatusTransition(
    current: MeetingGroupStatus,
    next: MeetingGroupStatus,
  ): void {
    const allowed = ALLOWED_STATUS_TRANSITIONS[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException({
        message: `Invalid status transition from '${current}' to '${next}'`,
        code: 'INVALID_STATUS_TRANSITION',
        details: {
          current,
          next,
          allowed: allowed.length > 0 ? allowed : 'none',
        },
      });
    }
  }

  private validateMeetingGroupConstraints(
    createMeetingGroupDto: CreateMeetingGroupDto & { createdBy: string },
  ): void {
    if (createMeetingGroupDto.after >= createMeetingGroupDto.before) {
      throw new BadRequestException({
        message: "'after' must be before 'before'",
        code: 'INVALID_TIME_CONSTRAINTS',
        details: {
          after: createMeetingGroupDto.after,
          before: createMeetingGroupDto.before,
        },
      });
    }

    if (createMeetingGroupDto.duration <= 0) {
      throw new BadRequestException({
        message: 'Duration must be greater than 0',
        code: 'INVALID_DURATION',
        details: {
          duration: createMeetingGroupDto.duration,
        },
      });
    }

    const status = createMeetingGroupDto.status as
      | MeetingGroupStatus
      | undefined;

    if (!status) {
      createMeetingGroupDto.status = MeetingGroupStatus.OPEN;
    } else if (status !== MeetingGroupStatus.OPEN) {
      throw new BadRequestException({
        message: 'MeetingGroup must be created with status OPEN',
        code: 'INVALID_INITIAL_STATUS',
      });
    }
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where: FindOptionsWhere<MeetingGroup> | FindOptionsWhere<MeetingGroup>[],
    relations?: FindOptionsRelations<MeetingGroup>,
  ) {
    const defaultRelations: FindOptionsRelations<MeetingGroup> = {
      participants: true,
      calendar: true,
    };

    const mergedRelations = { ...defaultRelations, ...relations };

    return await this.repository.find({
      where,
      relations: mergedRelations,
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
    this.validateMeetingGroupConstraints(createMeetingGroupDto);
    return await this.repository.save(
      this.repository.create(createMeetingGroupDto),
    );
  }

  async update(id: string, updateMeetingGroupDto: UpdateMeetingGroupDto) {
    const meetingGroup = await this.findOne(id);
    if (!meetingGroup) {
      throw new NotFoundException({
        message: 'MeetingGroup not found',
        code: 'NOT_FOUND',
      });
    }

    if (updateMeetingGroupDto.status) {
      this.validateStatusTransition(
        meetingGroup.status,
        updateMeetingGroupDto.status,
      );
    }

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

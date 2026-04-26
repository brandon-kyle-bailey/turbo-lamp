import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MeetingGroupVersion,
  MeetingGroupVersionStatus,
} from './entities/meeting-group-version.entity';
import { MeetingGroup } from './entities/meeting-group.entity';

export interface CreateVersionDto {
  meetingGroupId: string;
  after: Date;
  before: Date;
  duration: number;
  timezone: string;
  location?: string;
  createdBy?: string;
}

export interface UpdateVersionDto {
  after?: Date;
  before?: Date;
  duration?: number;
  timezone?: string;
  location?: string;
  computedSlots?: Array<{ start: string; end: string; rank: number }>;
  slotsComputedAt?: Date;
}

@Injectable()
export class MeetingGroupVersionsService {
  constructor(
    @InjectRepository(MeetingGroupVersion)
    private readonly versionRepository: Repository<MeetingGroupVersion>,
    @InjectRepository(MeetingGroup)
    private readonly meetingGroupRepository: Repository<MeetingGroup>,
  ) {}

  async createInitialVersion(
    meetingGroupId: string,
    dto: CreateVersionDto,
  ): Promise<MeetingGroupVersion> {
    const version = this.versionRepository.create({
      meetingGroupId,
      version: 1,
      status: MeetingGroupVersionStatus.ACTIVE,
      after: dto.after,
      before: dto.before,
      duration: dto.duration,
      timezone: dto.timezone,
      location: dto.location,
      createdBy: dto.createdBy,
    });

    await this.meetingGroupRepository.update(meetingGroupId, {
      currentVersion: 1,
    });

    return this.versionRepository.save(version);
  }

  async createNewVersion(
    meetingGroupId: string,
    dto: CreateVersionDto,
  ): Promise<MeetingGroupVersion> {
    const meetingGroup = await this.meetingGroupRepository.findOne({
      where: { id: meetingGroupId },
    });

    if (!meetingGroup) {
      throw new NotFoundException('MeetingGroup not found');
    }

    const previousVersion = await this.versionRepository.findOne({
      where: {
        meetingGroupId,
        version: meetingGroup.currentVersion,
      },
    });

    if (
      previousVersion &&
      previousVersion.status === MeetingGroupVersionStatus.ACTIVE
    ) {
      await this.versionRepository.update(previousVersion.id, {
        status: MeetingGroupVersionStatus.CANCELLED,
      });
    }

    const newVersion = this.versionRepository.create({
      meetingGroupId,
      version: meetingGroup.currentVersion + 1,
      status: MeetingGroupVersionStatus.ACTIVE,
      after: dto.after,
      before: dto.before,
      duration: dto.duration,
      timezone: dto.timezone,
      location: dto.location,
      createdBy: dto.createdBy,
    });

    await this.meetingGroupRepository.update(meetingGroupId, {
      currentVersion: meetingGroup.currentVersion + 1,
    });

    return this.versionRepository.save(newVersion);
  }

  async findActiveVersion(
    meetingGroupId: string,
  ): Promise<MeetingGroupVersion> {
    const meetingGroup = await this.meetingGroupRepository.findOne({
      where: { id: meetingGroupId },
    });

    if (!meetingGroup) {
      throw new NotFoundException('MeetingGroup not found');
    }

    const version = await this.versionRepository.findOne({
      where: {
        meetingGroupId,
        version: meetingGroup.currentVersion,
      },
    });

    if (!version) {
      throw new NotFoundException('Active version not found');
    }

    return version;
  }

  async findVersion(
    meetingGroupId: string,
    version: number,
  ): Promise<MeetingGroupVersion> {
    const versionEntity = await this.versionRepository.findOne({
      where: { meetingGroupId, version },
    });

    if (!versionEntity) {
      throw new NotFoundException('Version not found');
    }

    return versionEntity;
  }

  async findAllVersions(
    meetingGroupId: string,
  ): Promise<MeetingGroupVersion[]> {
    return this.versionRepository.find({
      where: { meetingGroupId },
      order: { version: 'DESC' },
    });
  }

  async updateVersion(
    meetingGroupId: string,
    version: number,
    dto: UpdateVersionDto,
  ): Promise<MeetingGroupVersion> {
    const versionEntity = await this.findVersion(meetingGroupId, version);

    if (versionEntity.status !== MeetingGroupVersionStatus.ACTIVE) {
      throw new Error('Can only update active versions');
    }

    await this.versionRepository.update(versionEntity.id, {
      ...dto,
      updatedAt: new Date(),
    });

    return this.findVersion(meetingGroupId, version);
  }

  async finalizeVersion(
    meetingGroupId: string,
    version: number,
  ): Promise<MeetingGroupVersion> {
    const versionEntity = await this.findVersion(meetingGroupId, version);

    if (versionEntity.status !== MeetingGroupVersionStatus.ACTIVE) {
      throw new Error('Can only finalize active versions');
    }

    await this.versionRepository.update(versionEntity.id, {
      status: MeetingGroupVersionStatus.FINALIZED,
      updatedAt: new Date(),
    });

    return this.findVersion(meetingGroupId, version);
  }

  async cancelVersion(
    meetingGroupId: string,
    version: number,
  ): Promise<MeetingGroupVersion> {
    const versionEntity = await this.findVersion(meetingGroupId, version);

    await this.versionRepository.update(versionEntity.id, {
      status: MeetingGroupVersionStatus.CANCELLED,
      updatedAt: new Date(),
    });

    return this.findVersion(meetingGroupId, version);
  }

  async getDerivedStatus(
    meetingGroupId: string,
  ): Promise<MeetingGroupVersionStatus> {
    const activeVersion = await this.findActiveVersion(meetingGroupId);
    return activeVersion.status;
  }

  async isActive(meetingGroupId: string): Promise<boolean> {
    const status = await this.getDerivedStatus(meetingGroupId);
    return status === MeetingGroupVersionStatus.ACTIVE;
  }

  async isFinalized(meetingGroupId: string): Promise<boolean> {
    const status = await this.getDerivedStatus(meetingGroupId);
    return status === MeetingGroupVersionStatus.FINALIZED;
  }
}

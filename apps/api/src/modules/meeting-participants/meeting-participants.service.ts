import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import {
  EnvironmentVariables,
  ParticipantAuthState,
  VerificationType,
  VerificationValue,
} from '../../lib/constants';
import { TokenService } from '../auth/token.service';
import { VerificationsService } from '../verifications/verifications.service';
import { MeetingParticipantAuthorizedEvent } from './events/meeting-participant-authorized.event';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { MeetingParticipant } from './entities/meeting-participant.entity';

@Injectable()
export class MeetingParticipantsService {
  constructor(
    @InjectRepository(MeetingParticipant)
    private readonly repository: Repository<MeetingParticipant>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(VerificationsService)
    private readonly verificationService: VerificationsService,
    private readonly eventBus: EventBus,
  ) {}
  async create(
    createMeetingParticipantDto: CreateMeetingParticipantDto & {
      createdBy: string;
    },
  ) {
    const result = await this.repository.save(
      this.repository.create(createMeetingParticipantDto),
    );
    if (
      createMeetingParticipantDto.auth_state &&
      ParticipantAuthState.AUTHORIZED === createMeetingParticipantDto.auth_state
    )
      return result;
    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;
    const expiresIn = ttl * 1000;
    const expiresAt = new Date(Date.now() + expiresIn);
    await this.verificationService.create({
      identifier: this.tokenService.randomHash(),
      value: this.tokenService.sign(
        {
          type: VerificationType.INVITE,
          id: result.id,
          to: result.email,
          after: 'onboarding_complete',
        } as VerificationValue,
        { expiresIn },
      ),
      expiresAt,
    });
    return result;
  }

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where:
      | FindOptionsWhere<MeetingParticipant>
      | FindOptionsWhere<MeetingParticipant>[],
    relations?: FindOptionsRelations<MeetingParticipant>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<MeetingParticipant>,
  ) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where:
      | FindOptionsWhere<MeetingParticipant>
      | FindOptionsWhere<MeetingParticipant>[],
    relations?: FindOptionsRelations<MeetingParticipant>,
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
    const updated = await this.repository.update(id, {
      ...updateMeetingParticipantDto,
    });
    if (!updated.affected) {
      throw new NotFoundException();
    }
    const result = await this.findOne(id);
    if (
      result &&
      updateMeetingParticipantDto.auth_state === ParticipantAuthState.AUTHORIZED
    ) {
      await this.eventBus.publish(
        new MeetingParticipantAuthorizedEvent(result),
      );
    }
    return result;
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meeting.id);
  }
}

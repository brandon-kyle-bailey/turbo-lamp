import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { EnvironmentVariables, VerificationValue } from '../../lib/constants';
import { TokenService } from '../auth/token.service';
import { VerificationsService } from '../verifications/verifications.service';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { CommandBus } from '@nestjs/cqrs';
import { MeetingParticipantAuthorizedCommand } from './commands/meeting-participant-authorized.command';

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
    private readonly commandBus: CommandBus,
  ) {}
  async create(
    createMeetingParticipantDto: CreateMeetingParticipantDto & {
      createdBy: string;
    },
  ) {
    const result = await this.repository.save(
      this.repository.create(createMeetingParticipantDto),
    );
    if (createMeetingParticipantDto.oauth_connected) return result;
    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;
    const expiresAt = new Date(Date.now() + ttl * 1000);
    await this.verificationService.create({
      identifier: randomBytes(32).toString('base64url'),
      value: this.tokenService.sign({
        type: 'invite',
        id: result.id,
        to: result.email,
        after: 'onboarding_complete',
      } as VerificationValue),
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
    if (result && updateMeetingParticipantDto.oauth_connected) {
      await this.commandBus.execute(
        new MeetingParticipantAuthorizedCommand(result),
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

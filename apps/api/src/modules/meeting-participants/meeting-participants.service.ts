import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { EnvironmentVariables, VerificationValue } from '../../lib/constants';
import { TokenService } from '../auth/token.service';
import { EmailService } from '../email/email.service';
import { VerificationsService } from '../verifications/verifications.service';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { MeetingParticipant } from './entities/meeting-participant.entity';

@Injectable()
export class MeetingParticipantsService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @InjectRepository(MeetingParticipant)
    private readonly repository: Repository<MeetingParticipant>,
    @Inject(VerificationsService)
    private readonly verificationService: VerificationsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}
  async create(createMeetingParticipantDto: CreateMeetingParticipantDto) {
    const result = this.repository.create(createMeetingParticipantDto);
    await this.repository.save(result);
    if (createMeetingParticipantDto.oauth_connected) return result;
    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const verification = await this.verificationService.create({
      identifier: randomBytes(32).toString('base64url'),
      value: this.tokenService.sign({
        type: 'invite',
        id: result.id,
        after: 'onboarding_complete',
      } as VerificationValue),
      expiresAt,
    });
    const url = `http://localhost:3000/onboarding/auth?token=${encodeURIComponent(verification.identifier)}`;
    await this.emailService.sendEmail({
      to: result.email,
      subject: "You've been invited to attend a booking.",
      text: `Click the following link to confirm: ${url}\nInvitation expires at ${expiresAt.toString()}`,
      html: `<p>Click <a href=${url}>here</a> to confirm.<br/>Invitation expires at ${expiresAt.toString()}</p>`,
    });
    return result;
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(
    id: string,
    relations?: FindOptionsRelations<MeetingParticipant>,
  ) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<MeetingParticipant>,
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
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    await this.repository.update(id, {
      ...meeting,
      ...updateMeetingParticipantDto,
    });
    return { ...meeting, ...updateMeetingParticipantDto };
  }

  async remove(id: string) {
    const meeting = await this.findOne(id);
    if (!meeting) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(meeting.id);
  }
}

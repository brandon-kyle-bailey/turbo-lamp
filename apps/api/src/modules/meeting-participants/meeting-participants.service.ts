import { randomBytes } from 'crypto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EnvironmentVariables } from '../../lib/constants';
import { EmailService } from '../email/email.service';
import { VerificationsService } from '../verifications/verifications.service';
import { CreateMeetingParticipantDto } from './dto/create-meeting-participant.dto';
import { UpdateMeetingParticipantDto } from './dto/update-meeting-participant.dto';
import { MeetingParticipant } from './entities/meeting-participant.entity';
import { TokenService } from '../auth/token.service';

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
    const participant = this.repository.create(createMeetingParticipantDto);
    const result = await this.repository.save(participant);
    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const verification = await this.verificationService.create({
      identifier: randomBytes(32).toString('base64url'),
      value: this.tokenService.sign({
        id: participant.meetingGroupId,
        type: 'meeting-group',
        after: 'http://localhost:3000/onboarding/complete',
      }),
      expiresAt,
    });
    const url = `http://localhost:3000/onboarding/auth?token=${encodeURIComponent(verification.identifier)}`;
    await this.emailService.sendEmail({
      to: participant.email,
      subject: "You've been invited to attend a booking.",
      text: `Click the following link to confirm: ${url}\nInvitation expires at ${expiresAt.toString()}`,
      html: `<p>Click <a href=${url}>here</a> to confirm.<br/>Invitation expires at ${expiresAt.toString()}</p>`,
    });
    return result;
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

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenService } from '../auth/token.service';
import { EmailService } from '../email/email.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(Verification)
    private readonly repository: Repository<Verification>,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}
  async create(createVerificationDto: CreateVerificationDto) {
    const value: JSON = JSON.parse(createVerificationDto.value) as JSON;
    const verification = this.repository.create({
      ...createVerificationDto,
      value: this.tokenService.sign(value),
    });
    const result = await this.repository.save(verification);

    if (Object.keys(value).includes('email')) {
      await this.emailService.sendEmail({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        to: value['email'],
        subject: 'Someone invited you to collaborate!',
        text: `token: ${createVerificationDto.value}`,
      });
    }
    return result;
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    return await this.repository.findOneBy({ id });
  }

  async update(id: string, updateVerificationDto: UpdateVerificationDto) {
    const verification = await this.findOne(id);
    return await this.repository.update(id, {
      ...verification,
      ...updateVerificationDto,
    });
  }

  async remove(id: string) {
    const verification = await this.findOne(id);
    if (!verification) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(verification.id);
  }
}

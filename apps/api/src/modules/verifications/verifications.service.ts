import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(Verification)
    private readonly repository: Repository<Verification>,
  ) {}
  async create(createVerificationDto: CreateVerificationDto) {
    const verification = this.repository.create(createVerificationDto);
    return await this.repository.save(verification);
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

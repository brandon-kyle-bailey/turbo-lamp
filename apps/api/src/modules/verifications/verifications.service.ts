import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(Verification)
    private readonly repository: Repository<Verification>,
    private readonly dataSource: DataSource,
  ) {}

  async consume(identifier: string): Promise<Verification | null> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Verification);

      const record = await repo.findOne({
        where: { identifier },
        lock: { mode: 'pessimistic_write' },
      });

      if (!record) return null;

      await repo.remove(record);

      return record;
    });
  }

  async create(createVerificationDto: CreateVerificationDto) {
    const verification = this.repository.create(createVerificationDto);
    return await this.repository.save(verification);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations?: FindOptionsRelations<Verification>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Verification>,
    relations?: FindOptionsRelations<Verification>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
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

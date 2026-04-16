import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {}

  async findAll() {
    return await this.repository.find();
  }

  async findAllBy(
    where: FindOptionsWhere<Session>,
    relations?: FindOptionsRelations<Session>,
  ) {
    return await this.repository.find({
      where,
      relations,
    });
  }

  async findOne(id: string, relations?: FindOptionsRelations<Session>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Session>,
    relations?: FindOptionsRelations<Session>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async create(createSessionDto: CreateSessionDto) {
    return await this.repository.save(this.repository.create(createSessionDto));
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const result = await this.repository.update(id, {
      ...updateSessionDto,
    });
    if (!result.affected) {
      throw new NotFoundException();
    }
    return await this.findOne(id);
  }

  async remove(id: string) {
    const session = await this.findOne(id);
    if (!session) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(session.id);
  }
}

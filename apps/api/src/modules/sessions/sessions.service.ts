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
  async create(createSessionDto: CreateSessionDto) {
    const session = this.repository.create(createSessionDto);
    return await this.repository.save(session);
  }

  async findAll() {
    return await this.repository.find();
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

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    return await this.repository.update(id, {
      ...session,
      ...updateSessionDto,
    });
  }

  async remove(id: string) {
    const session = await this.findOne(id);
    if (!session) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(session.id);
  }
}

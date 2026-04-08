import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.repository.create(createUserDto);
    return await this.repository.save(user);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations: (keyof User)[] = []) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(where: FindOptionsWhere<User>, relations: (keyof User)[]) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    return await this.repository.update(id, {
      ...user,
      ...updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(user.id);
  }
}

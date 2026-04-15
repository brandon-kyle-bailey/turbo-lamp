import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    const account = this.repository.create(createAccountDto);
    return await this.repository.save(account);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string, relations?: FindOptionsRelations<Account>) {
    return await this.findOneBy({ id }, relations);
  }

  async findOneBy(
    where: FindOptionsWhere<Account>,
    relations?: FindOptionsRelations<Account>,
  ) {
    return await this.repository.findOne({
      where,
      relations,
    });
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.findOne(id);
    await this.repository.update(id, {
      ...account,
      ...updateAccountDto,
    });
    return { ...account, ...updateAccountDto };
  }

  async remove(id: string) {
    const account = await this.findOne(id);
    if (!account) {
      throw new NotFoundException();
    }
    return await this.repository.softDelete(account.id);
  }
}

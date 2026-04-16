import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'accounts', version: '1' })
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.accountsService.findAllBy({ userId: req.user.id });
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.accountsService.findOneBy({ id, userId: req.user.id });
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    const found = await this.accountsService.findOneBy({
      id,
      userId: req.user.id,
    });
    if (!found) {
      throw new NotFoundException();
    }
    return await this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const found = await this.accountsService.findOneBy({
      id,
      userId: req.user.id,
    });
    if (!found) {
      throw new NotFoundException();
    }
    return await this.accountsService.remove(id);
  }
}

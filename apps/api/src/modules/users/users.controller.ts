import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  profile(@Req() req: Request & { user: Account }) {
    return req.user;
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException();
    }
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    if (id !== req.user.userId) {
      throw new UnauthorizedException();
    }
    return await this.usersService.remove(id);
  }
}

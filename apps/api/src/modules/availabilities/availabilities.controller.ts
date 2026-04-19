import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { AvailabilitiesService } from './availabilities.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'availabilities', version: '1' })
export class AvailabilitiesController {
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return await this.availabilitiesService.create({
      ...createAvailabilityDto,
      createdBy: req.user.userId,
    });
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.availabilitiesService.findAllBy({
      userId: req.user.userId,
    });
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.availabilitiesService.findOneBy({
      id,
      userId: req.user.userId,
    });
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return await this.availabilitiesService.update(id, updateAvailabilityDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.availabilitiesService.remove(id);
  }
}

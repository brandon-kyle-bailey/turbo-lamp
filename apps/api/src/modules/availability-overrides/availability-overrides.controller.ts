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
import { AvailabilityOverridesService } from './availability-overrides.service';
import { CreateAvailabilityOverrideDto } from './dto/create-availability-override.dto';
import { UpdateAvailabilityOverrideDto } from './dto/update-availability-override.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'availability-overrides', version: '1' })
export class AvailabilityOverridesController {
  constructor(
    private readonly availabilityOverridesService: AvailabilityOverridesService,
  ) {}

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createAvailabilityOverrideDto: CreateAvailabilityOverrideDto,
  ) {
    return await this.availabilityOverridesService.create({
      ...createAvailabilityOverrideDto,
      createdBy: req.user.userId,
      userId: req.user.userId,
    });
  }

  @Get()
  async findAll(@Req() req: Request & { user: Account }) {
    return await this.availabilityOverridesService.findAllBy({
      userId: req.user.userId,
    });
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.availabilityOverridesService.findOneBy({
      id,
      userId: req.user.userId,
    });
  }

  @Patch(':id')
  async update(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
    @Body() updateAvailabilityOverrideDto: UpdateAvailabilityOverrideDto,
  ) {
    return await this.availabilityOverridesService.update(
      id,
      updateAvailabilityOverrideDto,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    return await this.availabilityOverridesService.remove(id);
  }
}

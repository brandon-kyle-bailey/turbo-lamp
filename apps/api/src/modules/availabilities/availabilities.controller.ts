import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
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
  private readonly logger = new Logger(AvailabilitiesController.name);
  constructor(private readonly availabilitiesService: AvailabilitiesService) {}

  @Post('upsert/batch')
  async upsertBatch(
    @Req() req: Request & { user: Account },
    @Body() createAvailabilityDto: CreateAvailabilityDto[] & { userId: string },
  ) {
    const promises = createAvailabilityDto.map((dto) => {
      return this.availabilitiesService.upsert({
        ...dto,
        userId: req.user.userId,
        createdBy: req.user.userId,
      });
    });
    return await Promise.all(promises);
  }

  @Post('upsert')
  async upsert(
    @Req() req: Request & { user: Account },
    @Body() createAvailabilityDto: CreateAvailabilityDto & { userId: string },
  ) {
    return await this.availabilitiesService.upsert({
      ...createAvailabilityDto,
      userId: req.user.userId,
      createdBy: req.user.userId,
    });
  }

  @Post()
  async create(
    @Req() req: Request & { user: Account },
    @Body() createAvailabilityDto: CreateAvailabilityDto & { userId: string },
  ) {
    return await this.availabilitiesService.create({
      ...createAvailabilityDto,
      userId: req.user.userId,
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
    const existing = await this.availabilitiesService.findOneBy({
      id,
      userId: req.user.userId,
    });
    if (!existing) {
      throw new NotFoundException();
    }
    return await this.availabilitiesService.update(id, updateAvailabilityDto);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user: Account },
    @Param('id') id: string,
  ) {
    const existing = await this.availabilitiesService.findOneBy({
      id,
      userId: req.user.userId,
    });
    if (!existing) {
      throw new NotFoundException();
    }
    return await this.availabilitiesService.remove(id);
  }
}

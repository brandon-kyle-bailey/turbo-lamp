import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';

@Controller({ path: 'verifications', version: '1' })
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Post()
  async create(@Body() createVerificationDto: CreateVerificationDto) {
    return await this.verificationsService.create(createVerificationDto);
  }

  @Get()
  async findAll() {
    return await this.verificationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.verificationsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    return await this.verificationsService.update(id, updateVerificationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.verificationsService.remove(id);
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../auth/token.service';
import { EmailModule } from '../email/email.module';
import { Verification } from './entities/verification.entity';
import { VerificationsController } from './verifications.controller';
import { VerificationsService } from './verifications.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Verification]), EmailModule],
  controllers: [VerificationsController],
  providers: [JwtService, TokenService, VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}

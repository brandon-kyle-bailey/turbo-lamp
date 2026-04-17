import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Verification } from './entities/verification.entity';
import { VerificationsService } from './verifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Verification]),
    forwardRef(() => AuthModule),
  ],
  controllers: [],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}

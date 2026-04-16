import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Verification } from './entities/verification.entity';
import { VerificationsService } from './verifications.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Verification]),
    forwardRef(() => AuthModule),
    NotificationsModule,
  ],
  controllers: [],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}

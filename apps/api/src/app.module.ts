import KeyvRedis, { Keyv } from '@keyv/redis';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheableMemory } from 'cacheable';
import { EnvironmentVariables } from './lib/constants';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { HealthModule } from './modules/health/health.module';
import { MeetingAttendeesModule } from './modules/meeting-attendees/meeting-attendees.module';
import { MeetingGroupsModule } from './modules/meeting-groups/meeting-groups.module';
import { MeetingParticipantsModule } from './modules/meeting-participants/meeting-participants.module';
import { MeetingSlotsModule } from './modules/meeting-slots/meeting-slots.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { UsersModule } from './modules/users/users.module';
import { VerificationsModule } from './modules/verifications/verifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      expandVariables: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get<string>(
            EnvironmentVariables.DATABASE_URL,
            'postgres://postgres:postgres@postgres:5432/core',
          ),
          synchronize: true,
          autoLoadEntities: true,
          migrations: [__dirname + '/migrations/*.{js,ts}'],
          // migrationsRun: true,
          retryAttempts: 10,
          retryDelay: 5000,
        };
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const privateKey = config.get<string>(
          EnvironmentVariables.JWT_PRIVATE,
        )!;
        const publicKey = config.get<string>(EnvironmentVariables.JWT_PUBLIC)!;
        return {
          global: true,
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: config.get<number>(EnvironmentVariables.TOKEN_TTL)!,
            issuer: 'auth-server',
            audience: 'api',
          },
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>(
          EnvironmentVariables.REDIS_URL,
          'redis://default@redis:6379',
        );
        return {
          stores: [
            new Keyv({ store: new KeyvRedis(redisUrl), ttl: 5_000 }),
            new Keyv({
              store: new CacheableMemory({ ttl: 5_000, lruSize: 5_000 }),
            }),
          ],
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1_000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60_000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3_600_000,
        limit: 1_000,
      },
    ]),
    HttpModule,
    AuthModule,
    HealthModule,
    UsersModule,
    AccountsModule,
    SessionsModule,
    VerificationsModule,
    MeetingGroupsModule,
    MeetingParticipantsModule,
    MeetingSlotsModule,
    MeetingsModule,
    MeetingAttendeesModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

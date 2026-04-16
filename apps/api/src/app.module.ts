import KeyvRedis from '@keyv/redis';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheableMemory } from 'cacheable';
import Redis from 'ioredis';
import Keyv from 'keyv';
import { UseCacheInterceptor } from './interceptors/cache.interceptor';
import { EnvironmentVariables } from './lib/constants';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalendarsModule } from './modules/calendars/calendars.module';
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
            expiresIn: Number(config.get(EnvironmentVariables.TOKEN_TTL)),
            issuer: 'auth-server',
            audience: 'api',
          },
        };
      },
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>(
          EnvironmentVariables.REDIS_CACHE_URL,
        );
        if (!redisUrl) throw new Error('REDIS_CACHE_URL missing');
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: 10_000,
                lruSize: 5_000,
              }),
            }),
            new Keyv({
              store: new KeyvRedis(redisUrl),
              ttl: 10_000,
            }),
          ],
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          { name: 'short', ttl: 1_000, limit: 10 },
          { name: 'medium', ttl: 60_000, limit: 100 },
          { name: 'long', ttl: 3_600_000, limit: 1000 },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(
            config.get<string>(EnvironmentVariables.REDIS_THROTTLE_URL)!,
            {
              connectTimeout: 5_000,
              commandTimeout: 2_000,
              maxRetriesPerRequest: 3,
              retryStrategy: (times) => Math.min(times * 200, 2_000),
              keepAlive: 10_000,
              enableOfflineQueue: false,
            },
          ),
        ),
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>(EnvironmentVariables.REDIS_QUEUE_URL);
        if (!url) throw new Error('REDIS_QUEUE_URL missing');

        return {
          connection: {
            url,
            maxRetriesPerRequest: null,
          },
          defaultJobOptions: {
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: 1000,
            removeOnFail: 5000,
          },
        };
      },
    }),
    CqrsModule.forRoot(),
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
    CalendarsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UseCacheInterceptor,
    },
  ],
})
export class AppModule {}

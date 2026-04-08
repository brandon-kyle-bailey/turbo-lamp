import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentVariables } from 'src/lib/constants';
import { AccountsModule } from '../accounts/accounts.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { VerificationsModule } from '../verifications/verifications.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [
    PassportModule,
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
    AccountsModule,
    UsersModule,
    SessionsModule,
    VerificationsModule,
  ],
  controllers: [AuthController],
  providers: [
    TokenService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}

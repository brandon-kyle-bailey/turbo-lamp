import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
import { GoogleAuthManager } from './managers/google-auth.manager';
import { GoogleTokenService } from './google-token.service';

@Module({
  imports: [
    PassportModule,
    AccountsModule,
    UsersModule,
    SessionsModule,
    VerificationsModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    TokenService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    AuthService,
    GoogleTokenService,
    GoogleAuthManager,
  ],
  exports: [AuthService, TokenService, GoogleAuthManager],
})
export class AuthModule {}

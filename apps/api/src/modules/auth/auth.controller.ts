import {
  Body,
  Controller,
  Get,
  Inject,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';
import express from 'express';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { OAuthGuard } from '../../guards/oauth-auth.guard';
import { OAuthInitiationGuard } from '../../guards/oauth-initiation.guard';
import { SessionCookieInterceptor } from '../../interceptors/session-cookie.interceptor';
import {
  AccountProvider,
  CookieKey,
  SANITIZED_ROUTES,
  VerificationValue,
} from '../../lib/constants';
import { Account } from '../accounts/entities/account.entity';
import { VerificationsService } from '../verifications/verifications.service';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SessionResponseDto } from './dto/session.response.dto';
import { TokenService } from './token.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(VerificationsService)
    private readonly verificationService: VerificationsService,
    @Inject(CookieService)
    private readonly cookieService: CookieService,
  ) {}

  @UseInterceptors(SessionCookieInterceptor)
  @Post('register')
  async register(
    @Req() req: Request,
    @Ip() ip: string,
    @Body() body: RegisterDto,
  ): Promise<SessionResponseDto> {
    const result = await this.authService.register(body, {
      userAgent: req.headers['user-agent'],
      ip,
    });

    return plainToInstance(SessionResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SessionCookieInterceptor)
  @Post('login')
  async login(
    @Req() req: Request,
    @Ip() ip: string,
    @Body() body: LoginDto,
  ): Promise<SessionResponseDto> {
    const account = await this.authService.validateUser(
      body.username,
      AccountProvider.CREDENTIALS,
      body.password,
    );
    if (!account) {
      throw new UnauthorizedException();
    }
    const result = await this.authService.login(account, {
      userAgent: req.headers['user-agent'],
      ip,
    });

    return plainToInstance(SessionResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(OAuthInitiationGuard)
  @Get('oauth/:provider')
  getProvider() {}

  @UseGuards(OAuthGuard)
  @Get('oauth/callback/:provider')
  async getProviderCallback(
    @Query('state') state: string,
    @Req() req: Request & { user: Account },
    @Ip() ip: string,
    @Res() res: express.Response,
  ) {
    const verification = await this.verificationService.consume(state);

    if (!verification) {
      throw new UnauthorizedException();
    }

    let redirect: string = SANITIZED_ROUTES.dashboard;

    if (verification.value !== '') {
      const payload = this.tokenService.verify<VerificationValue>(
        verification.value,
      );
      const base = SANITIZED_ROUTES[payload.after];
      if (!base) throw new UnauthorizedException();

      redirect = `${base}/${payload.id}`;
    }

    const session = await this.authService.login(req.user, {
      userAgent: req.headers['user-agent'],
      ip,
    });

    this.cookieService.attachCookie(res, CookieKey.SESSION, session.token);
    res.redirect(`http://localhost:3000${redirect}`);
  }
}

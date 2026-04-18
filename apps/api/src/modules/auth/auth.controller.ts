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
} from '@nestjs/common';
import type { Request } from 'express';
import express from 'express';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { OAuthGuard } from '../../guards/oauth-auth.guard';
import { OAuthInitiationGuard } from '../../guards/oauth-initiation.guard';
import { SANITIZED_ROUTES, VerificationValue } from '../../lib/constants';
import { Account } from '../accounts/entities/account.entity';
import { Session } from '../sessions/entities/session.entity';
import { VerificationsService } from '../verifications/verifications.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(VerificationsService)
    private verificationService: VerificationsService,
  ) {}

  @Post('register')
  async register(
    @Req() req: Request,
    @Ip() ip: string,
    @Body() body: RegisterDto,
  ): Promise<Session> {
    return await this.authService.register(body, {
      userAgent: req.headers['user-agent'],
      ip,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request & { user: Account },
    @Ip() ip: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: LoginDto,
  ): Promise<Session> {
    return await this.authService.login(req.user, {
      userAgent: req.headers['user-agent'],
      ip,
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

    res.cookie('session', session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      domain: 'localhost',
      path: '/',
    });
    res.redirect(`http://localhost:3000${redirect}`);
  }
}

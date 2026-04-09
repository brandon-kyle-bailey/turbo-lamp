import {
  Body,
  Controller,
  Get,
  Inject,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import express from 'express';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { OAuthGuard } from 'src/guards/oauth-auth.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Account } from '../accounts/entities/account.entity';
import { Session } from '../sessions/entities/session.entity';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request & { user: Account }): User {
    return req.user.user;
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

  @UseGuards(OAuthGuard)
  @Get('oauth/:provider')
  getProvider() {}

  @UseGuards(OAuthGuard)
  @Get('oauth/callback/:provider')
  async getProviderCallback(
    // @Query('state') state: string,
    @Req() req: Request & { user: Account },
    @Ip() ip: string,
    @Res() res: express.Response,
  ) {
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
    res.redirect('http://localhost:3000/dashboard');
  }
}

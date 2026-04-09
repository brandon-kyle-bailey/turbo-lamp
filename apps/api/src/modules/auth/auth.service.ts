import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AccountProvider, EnvironmentVariables } from '../../lib/constants';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';
import { Session } from '../sessions/entities/session.entity';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { VerificationsService } from '../verifications/verifications.service';
import { TokenSchema, TokenService } from './token.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TokenService)
    private tokenService: TokenService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(AccountsService)
    private readonly accountService: AccountsService,
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(SessionsService)
    private readonly sessionService: SessionsService,
    @Inject(VerificationsService)
    private readonly verificationService: VerificationsService,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  async validateUser(
    username: string,
    provider: AccountProvider,
    password?: string,
  ): Promise<Account | null> {
    if (provider === AccountProvider.CREDENTIALS && !password) {
      throw new UnauthorizedException();
    }
    const account = await this.accountService.findOneBy(
      {
        providerId: provider,
        user: { email: username },
      },
      ['user'],
    );

    if (!account) {
      return null;
    }

    if (!password) {
      return account;
    }

    const isMatch = await bcrypt.compare(password, account.password!);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return account;
  }

  async login(
    account: Account,
    metadata?: { userAgent: string | undefined; ip: string | undefined },
  ): Promise<Session> {
    const payload: TokenSchema = {
      sub: account.user.id,
      username: account.user.email,
      provider: account.providerId,
    };
    const token_ttl = this.configService.get<number>(
      EnvironmentVariables.TOKEN_TTL,
    )!;
    const token = this.tokenService.sign(payload);
    const session = await this.sessionService.create({
      userId: account.user.id,
      token: token,
      expiresAt: new Date(Date.now() + token_ttl * 1000),
      ipAddress: metadata && metadata.ip ? metadata.ip : undefined,
      userAgent:
        metadata && metadata.userAgent ? metadata.userAgent : undefined,
    });
    await this.emailService.sendEmail({
      to: account.user.email,
      subject: 'test',
    });
    return session;
  }
}

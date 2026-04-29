import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import {
  AccountProvider,
  EnvironmentVariables,
  PROVIDERS,
} from '../../../lib/constants';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

const PROVIDER: PROVIDERS = 'google';
const SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/calendar'];

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, PROVIDER) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(AccountsService)
    private readonly accountService: AccountsService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {
    super({
      clientID: configService.get<string>(
        EnvironmentVariables.GOOGLE_CLIENT_ID,
      )!,
      clientSecret: configService.get<string>(
        EnvironmentVariables.GOOGLE_CLIENT_SECRET,
      )!,
      callbackURL: configService.get<string>(
        EnvironmentVariables.GOOGLE_CALLBACK_URL,
      )!,
      scope: SCOPES,
    });
  }

  authorizationParams() {
    return {
      access_type: 'offline',
      prompt: 'consent',
      session: 'false',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<Account> {
    const { value: email } = profile.emails![0];
    let account = await this.authService.validateUser(
      email,
      AccountProvider.GOOGLE,
    );

    if (account) {
      account.accessToken = accessToken;
      account.accessTokenExpiresAt = new Date(Date.now() + 3600 * 1000);
      if (refreshToken) {
        account.refreshToken = refreshToken;
      }
      await this.accountService.update(account.id, account);
      return account;
    }

    const user = await this.userService.create({
      name: profile.displayName,
      email,
      emailVerified: true,
    });
    user.calendars = [];
    account = await this.accountService.create({
      userId: user.id,
      accountId: profile.id,
      providerId: AccountProvider.GOOGLE,
      scope: SCOPES.join(','),
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
    });
    account.user = user;
    return account;
  }
}

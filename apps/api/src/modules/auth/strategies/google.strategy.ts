import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { UsersService } from '../../users/users.service';
import {
  PROVIDERS,
  EnvironmentVariables,
  AccountProvider,
} from '../../../lib/constants';
import { AuthService } from '../auth.service';

const PROVIDER: PROVIDERS = 'google';
const SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/calendar'];

interface ExtendedStrategyOptions extends StrategyOptions {
  accessType?: string;
  prompt?: string;
}

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
      accessType: 'offline',
      prompt: 'consent',
    } as ExtendedStrategyOptions);
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
    if (!account) {
      const user = await this.userService.create({
        name: profile.displayName,
        email,
        emailVerified: true,
      });
      account = await this.accountService.create({
        userId: user.id,
        accountId: profile.id,
        providerId: AccountProvider.GOOGLE,
        scope: SCOPES.join(','),
        accessToken,
        refreshToken,
      });
      account.user = user;
    }
    return account;
  }
}

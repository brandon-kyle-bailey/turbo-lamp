import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import {
  AccountProvider,
  EnvironmentVariables,
  PROVIDERS,
} from 'src/lib/constants';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

const PROVIDER: PROVIDERS = 'github';
const SCOPES = ['user:email', 'read:user'];

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, PROVIDER) {
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
        EnvironmentVariables.GITHUB_CLIENT_ID,
      )!,
      clientSecret: configService.get<string>(
        EnvironmentVariables.GITHUB_CLIENT_SECRET,
      )!,
      callbackURL: configService.get<string>(
        EnvironmentVariables.GITHUB_CALLBACK_URL,
      )!,
      scope: SCOPES,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<Account> {
    const { value: email } = profile.emails![0];
    let account = await this.authService.validateUser(
      email,
      AccountProvider.GITHUB,
    );

    if (account) {
      account.accessToken = accessToken;
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
    account = await this.accountService.create({
      userId: user.id,
      accountId: profile.id,
      providerId: AccountProvider.GITHUB,
      scope: SCOPES.join(','),
      accessToken,
      refreshToken,
    });
    account.user = user;
    return account;
  }
}

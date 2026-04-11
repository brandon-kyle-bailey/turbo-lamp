import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../lib/constants';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { GoogleTokenService } from '../google-token.service';

@Injectable()
export class GoogleAuthManager {
  constructor(
    private readonly config: ConfigService,
    private readonly accountService: AccountsService,
    private readonly tokenService: GoogleTokenService,
  ) {}

  async getValidAccessToken(account: Account): Promise<string> {
    const now = Date.now();
    const expired =
      !account.accessTokenExpiresAt ||
      account.accessTokenExpiresAt.getTime() <= now;

    if (!expired) return account.accessToken!;

    const refreshed = await this.tokenService.refreshAccessToken({
      clientId: this.config.get(EnvironmentVariables.GOOGLE_CLIENT_ID)!,
      clientSecret: this.config.get(EnvironmentVariables.GOOGLE_CLIENT_SECRET)!,
      refreshToken: account.refreshToken!,
    });

    account.accessToken = refreshed.accessToken;
    account.accessTokenExpiresAt = new Date(
      Date.now() + refreshed.expiresIn * 1000,
    );

    await this.accountService.update(account.id, account);

    return account.accessToken;
  }
}

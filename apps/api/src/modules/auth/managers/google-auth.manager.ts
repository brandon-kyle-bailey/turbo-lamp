import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../../libs/constants';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { GoogleTokenService } from '../google-token.service';

@Injectable()
export class GoogleAuthManager {
  private readonly logger: Logger = new Logger(GoogleAuthManager.name);
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

    const newExpires = new Date(Date.now() + refreshed.expiresIn * 1000);
    account.accessToken = refreshed.accessToken;
    account.accessTokenExpiresAt = newExpires;

    await this.accountService.update(account.id, {
      accessToken: refreshed.accessToken,
      accessTokenExpiresAt: newExpires,
    });

    return account.accessToken;
  }
}

import { AccountProvider } from '../../../lib/constants';

export class CreateAccountDto {
  userId: string;
  accountId: string;
  providerId: AccountProvider;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  password?: string;
}

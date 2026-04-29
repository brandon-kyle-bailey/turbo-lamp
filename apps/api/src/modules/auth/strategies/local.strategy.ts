import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountProvider } from '../../../libs/constants';
import { Account } from '../../accounts/entities/account.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<Account> {
    const account = await this.authService.validateUser(
      username,
      AccountProvider.CREDENTIALS,
      password,
    );
    if (!account) {
      throw new UnauthorizedException();
    }
    return account;
  }
}

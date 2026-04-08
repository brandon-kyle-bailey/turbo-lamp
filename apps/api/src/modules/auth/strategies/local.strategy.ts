import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { AccountProvider } from '../../../lib/constants';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(AccountsService)
    private readonly accountService: AccountsService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<Account> {
    let account = await this.authService.validateUser(
      username,
      AccountProvider.CREDENTIALS,
      password,
    );
    if (!account) {
      const user = await this.userService.create({
        name: username,
        email: username,
        emailVerified: false,
      });
      account = await this.accountService.create({
        userId: user.id,
        accountId: user.id,
        providerId: AccountProvider.CREDENTIALS,
        password: bcrypt.hashSync(password, 10),
      });
      account.user = user;
    }
    return account;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  EnvironmentVariables,
  TOKEN_ALGORITHM,
  TOKEN_AUDIENCE,
  TOKEN_ISSUER,
} from 'src/lib/constants';
import { AccountsService } from '../../accounts/accounts.service';
import { Account } from '../../accounts/entities/account.entity';
import { TokenSchema } from '../token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(AccountsService)
    private readonly accountService: AccountsService,
  ) {
    const privateKey = configService.get<string>(
      EnvironmentVariables.JWT_PRIVATE,
    )!;
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request): string | null => {
          if (!req?.cookies) return null;
          return typeof req.cookies.session === 'string'
            ? req.cookies.session
            : null;
        },
      ]),
      secretOrKey: privateKey,
      algorithms: [TOKEN_ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
  }

  async validate(payload: TokenSchema): Promise<Account | null> {
    const account = await this.accountService.findOneBy(
      {
        providerId: payload.provider,
        user: { id: payload.sub, email: payload.username },
      },
      {
        // TODO... This could load a lot in to memory on every authenticated request.
        user: {
          calendars: true,
          meetingGroups: true,
          participations: true,
          attendances: true,
          sessions: true,
          availabilityOverrides: true,
          availabilities: true,
        },
      },
    );

    if (!account) {
      return null;
    }
    return account;
  }
}

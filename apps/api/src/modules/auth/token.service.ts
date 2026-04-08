import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccountProvider, EnvironmentVariables } from '../../lib/constants';

export interface TokenSchema {
  sub: string;
  username: string;
  provider: AccountProvider;
}

@Injectable()
export class TokenService {
  constructor(
    @Inject(JwtService)
    private jwtService: JwtService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  sign<T extends object = any>(payload: T, options?: JwtSignOptions): string {
    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;
    const privateKey = this.configService.get<string>(
      EnvironmentVariables.JWT_PRIVATE,
    )!;
    return this.jwtService.sign(payload, {
      ...options,
      expiresIn: ttl,
      privateKey,
    });
  }
}

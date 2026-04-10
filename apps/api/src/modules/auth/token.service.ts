import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
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

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    const publicKey = this.configService.get<string>(
      EnvironmentVariables.JWT_PUBLIC,
    )!;
    return this.jwtService.verify<T>(token, {
      ...options,
      publicKey,
      algorithms: ['RS256'],
      issuer: 'auth-server',
      audience: 'api',
    });
  }

  sign<T extends object = any>(payload: T, options?: JwtSignOptions): string {
    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;
    const privateKey = this.configService.get<string>(
      EnvironmentVariables.JWT_PRIVATE,
    )!;
    return this.jwtService.sign(payload, {
      ...options,
      expiresIn: Number(ttl),
      privateKey,
      algorithm: 'RS256',
      issuer: 'auth-server',
      audience: 'api',
    });
  }
}

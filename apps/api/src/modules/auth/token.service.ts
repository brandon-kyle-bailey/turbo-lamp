import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import {
  AccountProvider,
  EnvironmentVariables,
  TOKEN_ALGORITHM,
  TOKEN_AUDIENCE,
  TOKEN_ISSUER,
} from '../../lib/constants';
import { randomBytes } from 'crypto';

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

  randomHash() {
    return randomBytes(32).toString('base64url');
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    const publicKey = this.configService.get<string>(
      EnvironmentVariables.JWT_PUBLIC,
    )!;
    return this.jwtService.verify<T>(token, {
      ...options,
      publicKey,
      algorithms: [TOKEN_ALGORITHM],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
  }

  sign<T extends object = any>(payload: T, options?: JwtSignOptions): string {
    const privateKey = this.configService.get<string>(
      EnvironmentVariables.JWT_PRIVATE,
    )!;
    return this.jwtService.sign(payload, {
      ...options,
      privateKey,
      algorithm: TOKEN_ALGORITHM,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });
  }
}

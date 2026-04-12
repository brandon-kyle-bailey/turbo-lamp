import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { randomBytes } from 'crypto';
import {
  EnvironmentVariables,
  PROVIDERS,
  STRATEGIES,
  VerificationValue,
} from '../lib/constants';
import { TokenService } from '../modules/auth/token.service';
import { VerificationsService } from '../modules/verifications/verifications.service';

@Injectable()
export class OAuthInitiationGuard implements CanActivate {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(VerificationsService)
    private readonly verificationService: VerificationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & {
      params: { provider: PROVIDERS };
      query?: { token?: string };
    } = context.switchToHttp().getRequest();

    const provider = req.params.provider;

    if (!STRATEGIES.includes(provider)) {
      throw new UnauthorizedException();
    }

    const guard = new (AuthGuard(provider))();

    let value = '';

    if (req.query?.token) {
      const token = await this.verificationService.consume(req.query.token);

      if (!token) {
        throw new UnauthorizedException();
      }

      if (new Date() >= token.expiresAt) {
        throw new UnauthorizedException();
      }

      const payload = this.tokenService.verify<VerificationValue>(token.value);
      if (payload.type !== 'invite' && payload.type !== 'oauth_state') {
        throw new UnauthorizedException();
      }

      value = token.value;
    }

    const ttl = this.configService.get<number>(EnvironmentVariables.TOKEN_TTL)!;

    const verification = await this.verificationService.create({
      identifier: randomBytes(32).toString('base64url'),
      value,
      expiresAt: new Date(Date.now() + ttl * 1000),
    });

    guard.getAuthenticateOptions = () => ({
      session: false,
      state: verification.identifier,
    });

    return guard.canActivate(context) as Promise<boolean>;
  }
}

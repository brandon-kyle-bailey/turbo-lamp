import { randomBytes } from 'crypto';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { PROVIDERS, STRATEGIES } from 'src/lib/constants';
import { VerificationsService } from '../modules/verifications/verifications.service';

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(
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

    const state = randomBytes(32).toString('base64url');
    const verification = await this.verificationService.create({
      identifier: state,
      value: req.query.token ? req.query.token : state,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    guard.getAuthenticateOptions = () => ({
      session: false,
      state: verification.identifier,
    });

    return guard.canActivate(context) as Promise<boolean>;
  }
}

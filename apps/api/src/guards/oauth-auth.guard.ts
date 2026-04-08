import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { PROVIDERS, STRATEGIES } from 'src/lib/constants';

@Injectable()
export class OAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & {
      params: { provider: PROVIDERS };
      query: { state?: string };
    } = context.switchToHttp().getRequest();

    const provider = req.params.provider;

    if (!STRATEGIES.includes(provider)) {
      throw new UnauthorizedException();
    }

    const guard = new (AuthGuard(provider))();

    guard.getAuthenticateOptions = () => ({
      session: false,
      state: req.query.state,
    });

    return guard.canActivate(context) as Promise<boolean>;
  }
}

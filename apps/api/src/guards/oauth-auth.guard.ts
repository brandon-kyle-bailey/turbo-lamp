import {
  CanActivate,
  ExecutionContext,
  Injectable,
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
    } = context.switchToHttp().getRequest();

    const provider = req.params.provider;

    if (!STRATEGIES.includes(provider)) {
      throw new UnauthorizedException();
    }

    const guard = new (AuthGuard(provider))();
    return guard.canActivate(context) as Promise<boolean>;
  }
}

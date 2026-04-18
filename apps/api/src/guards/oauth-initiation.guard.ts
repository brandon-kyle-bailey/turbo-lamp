import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PROVIDERS,
  STRATEGIES,
  VerificationType,
  VerificationValue,
} from '../lib/constants';
import { TokenService } from '../modules/auth/token.service';
import { VerificationsService } from '../modules/verifications/verifications.service';

@Injectable()
export class OAuthInitiationGuard implements CanActivate {
  constructor(
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

    const value: VerificationValue = {
      type: VerificationType.OAUTH_STATE,
      id: '',
      to: '',
      after: 'dashboard',
    };

    if (req.query?.token) {
      const token = await this.verificationService.consume(req.query.token);

      if (!token) {
        throw new UnauthorizedException();
      }

      if (new Date() >= token.expiresAt) {
        throw new UnauthorizedException();
      }

      const payload = this.tokenService.verify<VerificationValue>(token.value);
      if (!Object.values(VerificationType).includes(payload.type)) {
        throw new UnauthorizedException();
      }
      value.id = payload.id;
      value.to = payload.to;
      value.after = payload.after;
    }

    const expiresIn = 300000;
    // 5 minutes
    const expiresAt = new Date(Date.now() + expiresIn);
    const verification = await this.verificationService.create({
      identifier: this.tokenService.randomHash(),
      value: this.tokenService.sign(value, { expiresIn }),
      expiresAt,
    });

    guard.getAuthenticateOptions = () => ({
      session: false,
      state: verification.identifier,
    });

    return guard.canActivate(context) as Promise<boolean>;
  }
}

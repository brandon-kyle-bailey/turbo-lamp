import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { tap } from 'rxjs';
import express from 'express';
import { CookieService } from '../modules/auth/cookie.service';
import { CookieKey } from '../libs/constants';

@Injectable()
export class SessionCookieInterceptor implements NestInterceptor {
  constructor(
    @Inject(CookieService)
    private readonly cookieService: CookieService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const res: express.Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((data: { token?: string }) => {
        if (data?.token) {
          this.cookieService.attachCookie(res, CookieKey.SESSION, data.token);
        }
      }),
    );
  }
}

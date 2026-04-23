import express from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly config: ConfigService) {}

  attachCookie(
    response: express.Response,
    name: string,
    value: string,
    options?: CookieOptions,
  ) {
    // TODO: leverage config service to create production appropriate cookies.
    response.cookie(name, value, {
      ...options,
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      domain: 'localhost',
      path: '/',
    });
  }
}

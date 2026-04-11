import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GoogleTokenService {
  constructor(private readonly http: HttpService) {}

  async refreshAccessToken(params: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  }): Promise<{ accessToken: string; expiresIn: number }> {
    const { clientId, clientSecret, refreshToken } = params;

    const { data } = await firstValueFrom<{
      data: {
        access_token: string;
        expires_in: number;
      };
    }>(
      this.http.post('https://oauth2.googleapis.com/token', null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      }),
    );

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  }
}

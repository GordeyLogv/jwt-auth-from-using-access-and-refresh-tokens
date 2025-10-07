import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterDtoResponse } from 'src/auth/dto/auth.register.response.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresInSecond: number;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresInSecond: number;

  constructor(private readonly configService: ConfigService) {
    this.accessTokenSecret = this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.accessTokenExpiresInSecond = Number.parseInt(
      this.configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRES_IN_SECOND'),
    );

    this.refreshTokenSecret = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_SECRET',
    );
    this.refreshTokenExpiresInSecond = Number.parseInt(
      this.configService.getOrThrow<string>('REFRESH_TOKEN_EXPIRES_IN_SECOND'),
    );
  }

  public generateAccessToken(payload: AuthRegisterDtoResponse): string {
    return sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresInSecond,
    });
  }

  public generateRefreshToken(payload: AuthRegisterDtoResponse): string {
    return sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresInSecond,
    });
  }
}

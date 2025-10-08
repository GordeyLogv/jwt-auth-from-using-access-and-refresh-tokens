import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterDtoResponse } from 'src/auth/dto/auth.register.response.dto';
import { sign } from 'jsonwebtoken';
import { verifyJwt } from './util/jwt.wrapper';
import { IJwtVerifyPayload } from './interface/jwt.verify.payload.interface';
import { TokenEnum } from './enum/token.enum';

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

  public generateToken(
    payload: AuthRegisterDtoResponse,
    token: TokenEnum,
  ): string {
    const options = {
      [TokenEnum.ACCESS]: {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpiresInSecond,
      },
      [TokenEnum.REFRESH]: {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpiresInSecond,
      },
    }[token];

    if (!options) {
      throw new BadRequestException('Invalid token type');
    }

    return sign(payload, options.secret, {
      expiresIn: options.expiresIn,
    });
  }

  public verifyToken<T extends IJwtVerifyPayload>(
    token: string,
    tokenType: TokenEnum,
  ): T | null {
    const options = {
      [TokenEnum.ACCESS]: {
        secret: this.accessTokenSecret,
      },
      [TokenEnum.REFRESH]: {
        secret: this.refreshTokenSecret,
      },
    }[tokenType];

    if (!options) {
      throw new BadRequestException('Invalid token type');
    }

    const decodedData = verifyJwt<T>(token, options.secret, {
      ignoreExpiration: false,
    });

    return decodedData ? decodedData : null;
  }

  public verifyAccessTokenFromIgnoreExpiration<T extends IJwtVerifyPayload>(
    token: string,
  ): T | null {
    const decodedData = verifyJwt<T>(token, this.accessTokenSecret, {
      ignoreExpiration: true,
    });

    return decodedData ? decodedData : null;
  }
}

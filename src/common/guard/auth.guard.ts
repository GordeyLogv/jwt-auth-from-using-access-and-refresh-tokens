import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwtService/jwt.service';
import { Request } from 'express';
import { TokenEnum } from '../jwtService/enum/token.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid header format');
    }

    const person = this.jwtService.verifyToken(token, TokenEnum.ACCESS);

    if (!person) {
      throw new UnauthorizedException('Invalid token or token expired');
    }

    request.person = person;
    request.token = token;

    return true;
  }
}

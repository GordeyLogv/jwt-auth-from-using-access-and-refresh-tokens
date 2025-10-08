import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../jwtService/jwt.service';
import { Request } from 'express';
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid header format');
    }

    const person = this.jwtService.verifyAccessTokenFromIgnoreExpiration(token);

    if (!person) {
      throw new UnauthorizedException('Invalid token');
    }

    const existedPerson = await this.authRepository.getByEmail(person.email);

    if (!existedPerson) {
      throw new UnauthorizedException('Invalid token');
    }

    const personData = existedPerson.toResponse();

    const isValid =
      personData.email === person.email && personData.id === person.id;

    request.person = existedPerson;
    request.token = token;

    return isValid ? true : false;
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { AuthLoginDtoRequest } from './dto/auth.login.dto';
import { PersonEntity } from './entity/person.entity';
import { AuthRegisterDtoRequest } from './dto/auth.register.dto';
import { AuthRegisterDtoResponse } from './dto/auth.register.response.dto';
import { JwtService } from 'src/common/jwtService/jwt.service';
import { AuthLoginDtoResponse } from './dto/auth.login.response.dto';
import { TokenEnum } from 'src/common/jwtService/enum/token.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(dto: AuthLoginDtoRequest): Promise<AuthLoginDtoResponse> {
    const existedPerson = await this.authRepository.getByEmail(dto.email);

    if (!existedPerson) {
      throw new NotFoundException('Person with this email not found');
    }

    const isPasswordValid = await existedPerson.comparePassword(dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = existedPerson.toResponse();

    const accessToken = this.jwtService.generateToken(
      payload,
      TokenEnum.ACCESS,
    );

    const refreshToken = this.jwtService.generateToken(
      payload,
      TokenEnum.REFRESH,
    );

    await this.authRepository.updateRefreshToken(dto.email, refreshToken);

    return { accessToken };
  }

  public async register(
    dto: AuthRegisterDtoRequest,
  ): Promise<AuthRegisterDtoResponse> {
    const existedPerson = await this.authRepository.getByEmail(dto.email);

    if (existedPerson) {
      throw new ConflictException('Person with this email already exists');
    }

    const { password, ...dataToCreatePerson } = dto;

    const newPerson = PersonEntity.createNewPerson(dataToCreatePerson);

    await newPerson.setHashPassword(
      password,
      Number.parseInt(this.configService.getOrThrow<string>('SALT')),
    );

    const createdPerson = await this.authRepository.create(newPerson);

    return createdPerson.toResponse();
  }

  // async refresh(person: IJwtVerifyPayload) {

  // }
}

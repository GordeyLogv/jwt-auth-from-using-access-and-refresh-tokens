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
import { Request, Response } from 'express';
import { IJwtVerifyPayload } from 'src/common/jwtService/interface/jwt.verify.payload.interface';

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

    const accessToken = this.jwtService.generateAccessToken(
      existedPerson.toResponse(),
    );
    const refreshToken = this.jwtService.generateRefreshToken(
      existedPerson.toResponse(),
    );

    await this.authRepository.updateRefreshToken(dto.email, refreshToken);

    return { accessToken };
  }

  public async register(
    dto: AuthRegisterDtoRequest,
  ): Promise<AuthRegisterDtoResponse> {
    const existedPerson = await this.authRepository.getByEmail(dto.email);

    console.log(1);

    if (existedPerson) {
      throw new ConflictException('Person with this email already exists');
    }

    console.log(2);

    const { password, ...dataToCreatePerson } = dto;

    const newPerson = PersonEntity.createNewPerson(dataToCreatePerson);

    console.log(3);

    await newPerson.setHashPassword(
      password,
      Number.parseInt(this.configService.getOrThrow<string>('SALT')),
    );

    console.log(newPerson);

    const createdPerson = await this.authRepository.create(newPerson);

    console.log(5);

    return createdPerson.toResponse();
  }

  async refresh(person: IJwtVerifyPayload) {}
}

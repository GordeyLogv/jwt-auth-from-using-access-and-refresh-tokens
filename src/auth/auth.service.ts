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

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
  ) {}

  public async login(dto: AuthLoginDtoRequest): Promise<string> {
    const existedPerson = await this.authRepository.getByEmail(dto.email);

    if (!existedPerson) {
      throw new NotFoundException('Person with this email not found');
    }

    const isPasswordValid = await existedPerson.comparePassword(dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return 'Вход выполнен успешно';
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
}

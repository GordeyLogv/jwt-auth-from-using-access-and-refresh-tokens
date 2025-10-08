import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDtoRequest } from './dto/auth.register.dto';
import { AuthRegisterDtoResponse } from './dto/auth.register.response.dto';
import { AuthLoginDtoRequest } from './dto/auth.login.dto';
import { AuthLoginDtoResponse } from './dto/auth.login.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() dto: AuthRegisterDtoRequest,
  ): Promise<AuthRegisterDtoResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() dto: AuthLoginDtoRequest,
  ): Promise<AuthLoginDtoResponse> {
    return this.authService.login(dto);
  }

  // @Post('refresh')
  // public async refresh(): Promise<void> {}
}

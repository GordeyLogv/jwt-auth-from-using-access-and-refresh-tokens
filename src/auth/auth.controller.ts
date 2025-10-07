import { Controller, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDtoRequest } from './dto/auth.register.dto';
import { AuthRegisterDtoResponse } from './dto/auth.register.response.dto';
import { AuthLoginDtoRequest } from './dto/auth.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() dto: AuthRegisterDtoRequest,
  ): Promise<AuthRegisterDtoResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: AuthLoginDtoRequest): Promise<string> {
    return this.authService.login(dto);
  }
}

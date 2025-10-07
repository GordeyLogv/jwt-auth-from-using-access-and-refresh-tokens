import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { JwtService } from 'src/common/jwtService/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtService],
})
export class AuthModule {}

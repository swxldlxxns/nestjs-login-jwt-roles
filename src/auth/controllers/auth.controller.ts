import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const token = await this._authService.login(body);
    if (!token)
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    return { token };
  }

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return await this._authService.create(body);
  }
}

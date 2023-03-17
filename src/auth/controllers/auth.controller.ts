import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    return await this._authService.create(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const token = await this._authService.login(body);

    if (!token)
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);

    return { token };
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this._authService.delete(id);
  }
}

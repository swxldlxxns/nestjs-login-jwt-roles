import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { omit } from 'lodash';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { Roles } from '../decorators/roles.decorator';
import { CreateResponseDto } from '../dto/create-response.dto';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly _serviceName = AuthController.name;

  constructor(
    @Inject(Logger) private readonly _logger: Logger,
    private readonly _authService: AuthService,
  ) {}

  @ApiOkResponse({
    type: CreateResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Wrong params' })
  @Post('create')
  async create(@Body() body: CreateUserRequestDto): Promise<CreateResponseDto> {
    this._logger.log(
      omit(body, ['password', 'confirmPassword']),
      this._serviceName,
    );

    return await this._authService.create(body);
  }

  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Return a token',
  })
  @ApiBadRequestResponse({ description: 'Wrong credentials' })
  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    this._logger.log(omit(body, ['password']), this._serviceName);
    const token = await this._authService.login(body);

    if (!token)
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);

    return { token };
  }

  @ApiSecurity('bearer')
  @ApiOkResponse({
    type: Boolean,
    description: 'Return true',
  })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized request for non-administrator roles',
  })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<boolean> {
    this._logger.log(id, this._serviceName);

    return await this._authService.delete(id);
  }
}

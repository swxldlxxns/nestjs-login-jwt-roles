import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiUnauthorizedResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesEnum } from '../../shared/enums/roles.emun';
import { AppService } from '../services/app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @ApiOkResponse({ type: String, description: 'Return a greeting' })
  @Get()
  getHelloWorld(): string {
    return this._appService.getHelloWorld();
  }

  @ApiSecurity('bearer')
  @ApiOkResponse({ type: String, description: 'Return a greeting' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized request for non-administrator roles',
  })
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  getHelloAdmin(): string {
    return this._appService.getHelloAdmin();
  }

  @ApiSecurity('bearer')
  @ApiOkResponse({ type: String, description: 'Return a greeting' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized request for non-developer roles',
  })
  @Roles(RolesEnum.DEV)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('develop')
  getHelloDevelop(): string {
    return this._appService.getHelloDevelop();
  }
}

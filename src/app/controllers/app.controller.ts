import { Controller, Get, UseGuards } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesEnum } from '../../shared/enums/roles.emun';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get()
  getHelloWorld(): string {
    return this._appService.getHelloWorld();
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  getHelloAdmin(): string {
    return this._appService.getHelloAdmin();
  }

  @Roles(RolesEnum.DEV)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('develop')
  getHelloDevelop(): string {
    return this._appService.getHelloDevelop();
  }
}

import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { CreateUserDto } from '../dto/create-user.dto';
import { Auth } from '../entities/auth.entity';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const createUserDtoMock: CreateUserDto = {
    confirmPassword: 'test',
    password: 'test',
    role: RolesEnum.ADMIN,
    username: 'test',
  };
  const authModelMock: Auth = <Auth>{
    password: 'test',
    role: 'test',
    username: 'test',
  };
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(Auth.name),
          useValue: Auth,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should return user', async () => {
    jest
      .spyOn(authService, 'create')
      .mockImplementation(
        async (): Promise<Auth> => Promise.resolve(authModelMock),
      );
    expect(await authController.create(createUserDtoMock)).toEqual(
      authModelMock,
    );
  });
});

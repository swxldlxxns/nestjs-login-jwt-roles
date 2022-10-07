import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { Auth } from '../entities/auth.entity';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  const tokenMock = 'testToken';
  const createUserDtoMock: CreateUserDto = {
    confirmPassword: 'test',
    password: 'test',
    role: RolesEnum.ADMIN,
    username: 'test',
  };
  const loginDtoMock: LoginDto = {
    password: 'test',
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

  describe('login', () => {
    it('should return login', async () => {
      jest
        .spyOn(authService, 'login')
        .mockImplementation(
          async (): Promise<string> => Promise.resolve(tokenMock),
        );
      expect(await authController.login(loginDtoMock)).toEqual({
        token: tokenMock,
      });
    });

    it('should return error', async () => {
      jest
        .spyOn(authService, 'login')
        .mockImplementation(
          async (): Promise<string> => Promise.resolve(undefined),
        );
      await expect(authController.login(loginDtoMock)).rejects.toThrowError(
        HttpException,
      );
    });
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

  it('should delete user', async () => {
    jest
      .spyOn(authService, 'delete')
      .mockImplementation(async (): Promise<boolean> => Promise.resolve(true));
    expect(await authController.delete('1234')).toBeTruthy();
  });
});

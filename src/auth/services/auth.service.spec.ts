import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { omit } from 'lodash';
import { Model } from 'mongoose';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { Auth } from '../entities/auth.entity';
import { AuthInterface } from '../interfaces/auth.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const tokenMock = 'test';
  const authInterfaceMock: AuthInterface = {
    role: 'test',
    username: 'test',
    id: 'test',
  };
  const authMock: Auth = <Auth>{
    password: 'test',
    role: 'test',
    username: 'test',
  };
  const loginDtoMock: LoginRequestDto = {
    password: 'test',
    username: 'test',
  };
  const createUserDtoMock: CreateUserRequestDto = {
    confirmPassword: 'test',
    password: 'test',
    role: RolesEnum.DEV,
    username: 'test',
  };
  let jwtService: JwtService;
  let service: AuthService;
  let model: Model<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: {
            expiresIn: 1,
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: getModelToken(Auth.name),
          useValue: Auth,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    model = module.get<Model<Auth>>(getModelToken(Auth.name));
  });

  it('should return token', async () => {
    jest.spyOn(jwtService, 'sign').mockImplementation((): string => tokenMock);
    expect(await service.generate(authInterfaceMock)).toEqual(tokenMock);
  });

  it('should return a user', async () => {
    model.findOne = jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue(authMock),
    }));
    expect(await service.findOne({})).toEqual(authMock);
  });

  it('should return a new user', async () => {
    jest
      .spyOn(argon2, 'hash')
      .mockImplementation(async (): Promise<string> => Promise.resolve('test'));
    model.create = jest.fn().mockResolvedValue(authMock);
    model.findOne = jest.fn().mockImplementation(() => ({
      lean: jest.fn().mockResolvedValue(authMock),
    }));
    expect(await service.create(createUserDtoMock)).toEqual(
      omit(authMock, ['password']),
    );
  });

  it('should delete a user', async () => {
    model.findByIdAndDelete = jest.fn().mockResolvedValue(true);
    expect(await service.delete('1234')).toBeTruthy();
  });

  describe('login', () => {
    it('should return login', async () => {
      model.findOne = jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(authMock),
      }));
      jest
        .spyOn(argon2, 'verify')
        .mockImplementation(
          async (): Promise<boolean> => Promise.resolve(true),
        );
      jest
        .spyOn(jwtService, 'sign')
        .mockImplementation((): string => tokenMock);
      expect(await service.login(loginDtoMock)).toEqual(tokenMock);
    });
    it('should return false user', async () => {
      model.findOne = jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(undefined),
      }));
      expect(await service.login(loginDtoMock)).toBeFalsy();
    });
    it('should return false login', async () => {
      model.findOne = jest.fn().mockImplementation(() => ({
        lean: jest.fn().mockResolvedValue(authMock),
      }));
      jest
        .spyOn(argon2, 'verify')
        .mockImplementation(
          async (): Promise<boolean> => Promise.resolve(false),
        );
      expect(await service.login(loginDtoMock)).toBeFalsy();
    });
  });
});

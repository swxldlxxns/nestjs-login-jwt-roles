import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { Auth } from '../../auth/entities/auth.entity';
import { AuthService } from '../../auth/services/auth.service';
import { CustomRules } from './validation.service';

describe('CustomRules', () => {
  const args: ValidationArguments = {
    constraints: [],
    object: undefined,
    property: '',
    targetName: '',
    value: undefined,
  };
  let service: CustomRules;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CustomRules,
        JwtService,
        Logger,
        {
          provide: getModelToken(Auth.name),
          useValue: Auth,
        },
      ],
    }).compile();

    service = module.get<CustomRules>(CustomRules);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('property confirmPassword', async () => {
      args.property = 'confirmPassword';
      args.object = {
        password: 'testPassword',
      };
      args.constraints = ['password'];
      expect(await service.validate('testPassword', args)).toEqual(true);
    });
    it('property username', async () => {
      args.property = 'username';
      jest
        .spyOn(authService, 'findOne')
        .mockImplementation(
          async (): Promise<Auth> => Promise.resolve(undefined),
        );
      expect(await service.validate('testUsername', args)).toEqual(true);
    });
    it('should return an error', async () => {
      args.property = 'username';
      jest.spyOn(authService, 'findOne').mockRejectedValue(new Error());
      expect(await service.validate('testUsername', args)).toEqual(false);
    });
  });
  describe('defaultMessage', () => {
    it('confirmPassword', () => {
      args.property = 'confirmPassword';
      expect(service.defaultMessage(args)).toEqual(
        'confirmPassword must be equal to password',
      );
    });
    it('username', () => {
      args.property = 'username';
      expect(service.defaultMessage(args)).toEqual('username already exists');
    });
  });
});

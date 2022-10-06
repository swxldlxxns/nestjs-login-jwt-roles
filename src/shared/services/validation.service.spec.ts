import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';

import { Auth } from '../../auth/entities/auth.entity';
import { AuthService } from '../../auth/service/auth.service';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        CustomRules,
        JwtService,
        {
          provide: getModelToken(Auth.name),
          useValue: Auth,
        },
      ],
    }).compile();

    service = module.get<CustomRules>(CustomRules);
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
  });
  describe('defaultMessage', () => {
    it('confirmPassword', () => {
      args.property = 'confirmPassword';
      expect(service.defaultMessage(args)).toEqual(
        'confirmPassword must be equal to password',
      );
    });
  });
});

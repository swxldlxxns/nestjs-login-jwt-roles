import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Auth } from '../entities/auth.entity';
import { AuthInterface } from '../interfaces/auth.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const tokenMock = 'test';
  const authDtoMock: AuthInterface = {
    role: 'test',
    username: 'test',
    id: 'test',
  };
  let jwtService: JwtService;
  let service: AuthService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token', async () => {
    jest.spyOn(jwtService, 'sign').mockImplementation((): string => tokenMock);
    expect(await service.generate(authDtoMock)).toEqual(tokenMock);
  });
});

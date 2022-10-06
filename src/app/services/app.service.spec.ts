import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

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
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Hello World', () => {
    expect(service.getHelloWorld()).toEqual('Hello World!');
  });

  it('should return Hello World Admin', () => {
    expect(service.getHelloAdmin()).toEqual('Hello Role Admin!');
  });

  it('should return Hello World Develop', () => {
    expect(service.getHelloDevelop()).toEqual('Hello Role Develop!');
  });
});

import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../services/app.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return "Hello World!"', () => {
    expect(appController.getHelloWorld()).toBe('Hello World!');
  });

  it('should return "Hello Role Admin!"', () => {
    expect(appController.getHelloAdmin()).toBe('Hello Role Admin!');
  });

  it('should return "Hello Role Develop!"', () => {
    expect(appController.getHelloDevelop()).toBe('Hello Role Develop!');
  });
});

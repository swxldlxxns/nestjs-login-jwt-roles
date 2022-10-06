import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloWorld(): string {
    return 'Hello World!';
  }
  getHelloAdmin(): string {
    return 'Hello Role Admin!';
  }
  getHelloDevelop(): string {
    return 'Hello Role Develop!';
  }
}

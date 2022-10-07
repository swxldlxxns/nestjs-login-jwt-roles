import { Global, Module } from '@nestjs/common';

import { JWT_MODULE } from '../auth/interfaces/jwt.register';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';

@Global()
@Module({
  imports: [JWT_MODULE],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

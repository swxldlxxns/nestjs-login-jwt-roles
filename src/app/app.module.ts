import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JWT_MODULE } from '../auth/interfaces/jwt.register';
import { AppController } from './controllers/app.controller';
import { App, appSchema } from './entities/app.entity';
import { AppService } from './services/app.service';

@Global()
@Module({
  imports: [
    JWT_MODULE,
    MongooseModule.forFeature([
      {
        name: App.name,
        schema: appSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

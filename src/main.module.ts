import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppModule } from './app/app.module';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { DbModule } from './database/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    AuthModule,
    AppModule,
    DbModule,
  ],
})
export class MainModule {}

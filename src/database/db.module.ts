import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import config from '../config';

@Global()
@Module({
  exports: [MongooseModule],
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const { connection, user, pass, host, port, dbName } =
          configService.database;

        return {
          user,
          pass,
          dbName,
          uri: `${connection}://${host}:${port}`,
        };
      },
      inject: [config.KEY],
    }),
  ],
})
export class DbModule {}

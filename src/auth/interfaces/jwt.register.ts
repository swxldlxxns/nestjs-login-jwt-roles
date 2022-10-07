import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import config from '../../config';

export const JWT_MODULE = JwtModule.registerAsync({
  inject: [config.KEY],
  useFactory: (configService: ConfigType<typeof config>) => {
    const { secret, expiresIn } = configService.jwt;
    return {
      secret,
      signOptions: {
        expiresIn,
      },
    };
  },
});

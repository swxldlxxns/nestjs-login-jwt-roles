import { registerAs } from '@nestjs/config';

import { EnvironmentVariables } from './shared/interfaces/environment-variables.interface';

export default registerAs(
  'config',
  (): EnvironmentVariables => ({
    database: {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USE,
      pass: process.env.DB_PASS,
      port: parseInt(process.env.DB_PORT, 10),
      host: process.env.DB_HOST,
      connection: process.env.DB_CONNECTION,
    },
    jwt: {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    },
  }),
);

import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { CustomRules } from '../shared/services/validation.service';
import { AuthController } from './controllers/auth.controller';
import { Auth, authSchema } from './entities/auth.entity';
import { JWT_MODULE } from './interfaces/jwt.register';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Global()
@Module({
  controllers: [AuthController],
  imports: [
    JWT_MODULE,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: authSchema,
      },
    ]),
    PassportModule,
  ],
  exports: [AuthService],
  providers: [AuthService, CustomRules, JwtStrategy],
})
export class AuthModule {}

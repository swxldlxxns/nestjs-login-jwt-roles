import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { omit } from 'lodash';
import { Model } from 'mongoose';

import { CreateUserRequestDto } from '../dto/create-user-request.dto';
import { LoginRequestDto } from '../dto/login-request.dto';
import { Auth } from '../entities/auth.entity';
import { AuthInterface } from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly _serviceName = AuthService.name;

  constructor(
    @Inject(Logger) private readonly _logger: Logger,
    @InjectModel(Auth.name) private _authModel: Model<Auth>,
    private readonly _jwtService: JwtService,
  ) {}

  async generate(payload: AuthInterface): Promise<string> {
    this._logger.log(payload, this._serviceName);

    return this._jwtService.sign(payload);
  }

  async findOne(payload: object): Promise<Auth> {
    this._logger.log(payload, this._serviceName);

    return this._authModel.findOne(payload).lean();
  }

  async delete(id: string): Promise<boolean> {
    this._logger.log(id, this._serviceName);

    return !!this._authModel.findByIdAndDelete(id);
  }

  async login({ username, password }: LoginRequestDto): Promise<string> {
    this._logger.log(username, this._serviceName);

    const user: Auth = await this.findOne({ username });

    if (user && (await this._verifyPassword(user.password, password)))
      return this.generate({
        id: user._id,
        username: user.username,
        role: user.role,
      });

    return null;
  }

  async create(
    createUser: CreateUserRequestDto,
  ): Promise<Auth & { _id: string }> {
    this._logger.log(
      omit(createUser, ['password', 'confirmPassword']),
      this._serviceName,
    );

    const password = await this._hashPassword(createUser.password);

    await this._authModel.create({
      ...createUser,
      password,
    });

    const user: Auth = await this.findOne({ username: createUser.username });

    return <Auth & { _id: string }>omit(user, ['password']);
  }

  private async _hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async _verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}

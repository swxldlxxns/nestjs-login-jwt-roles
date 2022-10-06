import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { omit } from 'lodash';
import { Model } from 'mongoose';

import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { Auth } from '../entities/auth.entity';
import { AuthInterface } from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private _authModel: Model<Auth>,
    private readonly _jwtService: JwtService,
  ) {}

  async generate(payload: AuthInterface) {
    return this._jwtService.sign(payload);
  }

  async findOne(payload: object): Promise<Auth> {
    return this._authModel.findOne(payload).lean();
  }

  async login({ username, password }: LoginDto): Promise<string | boolean> {
    const user: Auth = await this.findOne({ username });
    if (!user) return false;
    const verify = await this._verifyPassword(user.password, password);
    return verify
      ? this.generate({
          id: user._id,
          username: user.username,
          role: user.role,
        })
      : false;
  }

  async create(createUser: CreateUserDto): Promise<Auth> {
    const password = await this._hashPassword(createUser.password);
    const user: Auth = await this._authModel.create({
      ...createUser,
      password,
    });
    return omit(user.toObject(), ['password']);
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

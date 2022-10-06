import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint } from 'class-validator';

import { AuthService } from '../../auth/services/auth.service';

@ValidatorConstraint({ name: 'CustomRules', async: true })
@Injectable()
export class CustomRules {
  constructor(private readonly _authService: AuthService) {}

  async validate(attr: any, args: ValidationArguments) {
    try {
      switch (args.property) {
        case 'confirmPassword':
          return attr === (args.object as any)[args.constraints[0]];
        case 'username':
          return !(await this._authService.findOne({ username: attr }));
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    switch (args.property) {
      case 'confirmPassword':
        return 'confirmPassword must be equal to password';
      case 'username':
        return 'username already exists';
    }
  }
}

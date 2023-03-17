import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { CustomRules } from '../../shared/services/validation.service';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Validate(CustomRules)
  readonly username: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\-$*.{}?"!@#%&\/\\,>·<':;|¨_€¬~`^\]\[\)\(])\S{8,}$/,
    {
      message:
        'password must be a minimum of 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character',
    },
  )
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(CustomRules, ['password'])
  readonly confirmPassword: string;

  @IsEnum(RolesEnum)
  @IsNotEmpty()
  readonly role: RolesEnum;
}

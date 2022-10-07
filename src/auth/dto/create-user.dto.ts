import { IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { CustomRules } from '../../shared/services/validation.service';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Validate(CustomRules)
  readonly username: string;

  @IsString()
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

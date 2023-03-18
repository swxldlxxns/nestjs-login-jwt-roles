import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';

import { RolesEnum } from '../../shared/enums/roles.emun';
import { CustomRules } from '../../shared/services/validation.service';

export class CreateUserRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Validate(CustomRules)
  readonly username: string;

  @ApiProperty({
    description:
      'password must be a minimum of 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character',
  })
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

  @ApiProperty({
    description: 'confirmPassword must be equal to password',
  })
  @IsString()
  @IsNotEmpty()
  @Validate(CustomRules, ['password'])
  readonly confirmPassword: string;

  @ApiProperty({ enum: RolesEnum })
  @IsEnum(RolesEnum)
  @IsNotEmpty()
  readonly role: RolesEnum;
}

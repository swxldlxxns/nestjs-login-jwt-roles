import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly role: string;

  @ApiProperty({ required: false })
  readonly __v?: number;
}

import { IsString } from 'class-validator';

export class UserLoginV1Dto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}

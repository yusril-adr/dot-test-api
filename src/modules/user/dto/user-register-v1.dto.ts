import { Match } from '@helpers/utils/decorators';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserRegisterV1Dto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @Match('password')
  confirm_password: string;
}

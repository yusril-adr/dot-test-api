import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class TodoCreateV1Dto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Transform(({ value }) => value === 'true')
  @IsNotEmpty()
  completed: boolean;
}

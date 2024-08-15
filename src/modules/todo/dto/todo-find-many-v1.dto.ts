import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class TodoFindManyV1Dto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(10)
  row: number = 10;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  user_id?: number;
}

import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PhotoFindManyV1Dto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  row: number = 10;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page: number = 1;
}

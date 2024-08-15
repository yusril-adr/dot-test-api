import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { Photo } from '@entities/photo.entity';
import { Type } from 'class-transformer';

export class PhotoCreateV1Dto extends Photo {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsUrl()
  url: string;

  @IsString()
  @IsUrl()
  thumbnailUrl: string;

  @IsNumber()
  @Type(() => Number)
  albumId: number;
}

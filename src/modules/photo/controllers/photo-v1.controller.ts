import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import * as wrapper from '@helpers/utils/wrapper';
import { Response, ResponsePagination } from '@helpers/types/response.type';
import { Photo } from '@entities/photo.entity';
import { PhotoV1UseCase } from '../usecases/photo-v1.usecase';
import { PhotoFindManyV1Dto } from '../dto/photo-find-many-v1.dto';
import { PhotoCreateV1Dto } from '../dto/photo-create-v1.dto';
import { PhotoUpdatePutV1Dto } from '../dto/photo-update-put-v1.dto';
import { PhotoUpdatePatchV1Dto } from '../dto/photo-update-patch-v1.dto';

@Controller({ path: 'photos', version: '1' })
export class PhotoV1Controller {
  constructor(private readonly photoUseCase: PhotoV1UseCase) {}

  @Post()
  async create(
    @Body() requestBody: PhotoCreateV1Dto,
  ): Promise<Response<Photo>> {
    const result = await this.photoUseCase.create(requestBody);

    return wrapper.response({
      data: result,
      message: 'Create Photo Success',
    });
  }

  @Get('')
  async findMany(
    @Query() request: PhotoFindManyV1Dto,
  ): Promise<ResponsePagination<Photo[]>> {
    const result = await this.photoUseCase.findMany(request);

    return wrapper.paginationResponse({
      ...result,
      message: 'Get Photo List Success',
    });
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<Response<Photo>> {
    const result = await this.photoUseCase.findById(id);

    return wrapper.response({
      data: result,
      message: 'Get Photo By Id Success',
    });
  }

  @Put('/:id')
  async updatePutById(
    @Param('id') id: number,
    @Body() requestBody: PhotoUpdatePutV1Dto,
  ): Promise<Response<Photo>> {
    const result = await this.photoUseCase.updatePutById(requestBody, id);

    return wrapper.response({
      data: result,
      message: 'Update Put Photo By Id Success',
    });
  }

  @Patch('/:id')
  async updatePatchById(
    @Param('id') id: number,
    @Body() requestBody: PhotoUpdatePatchV1Dto,
  ): Promise<Response<Photo>> {
    const result = await this.photoUseCase.updatePatchById(requestBody, id);

    return wrapper.response({
      data: result,
      message: 'Update Patch Photo By Id Success',
    });
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: number): Promise<Response<null>> {
    this.photoUseCase.deleteById(id);

    return wrapper.response({
      data: null,
      message: 'Delete Photo By Id Success',
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Photo } from '@entities/photo.entity';
import { paginationData, WrapperPaginationData } from '@helpers/utils/wrapper';
import { PaginationMeta } from '@helpers/types/pagination-meta.type';
import { CONFIG } from '@helpers/constants/config';
import { PhotoCreateV1Dto } from '../dto/photo-create-v1.dto';
import { PhotoFindManyV1Dto } from '../dto/photo-find-many-v1.dto';
import { PhotoUpdatePutV1Dto } from '../dto/photo-update-put-v1.dto';
import { PhotoUpdatePatchV1Dto } from '../dto/photo-update-patch-v1.dto';

@Injectable()
export class PhotoV1UseCase {
  private readonly axiosInstance = axios.create({
    baseURL: CONFIG.API_BASE_URL,
  });

  constructor() {}

  async create(request: PhotoCreateV1Dto): Promise<Photo> {
    const response = await this.axiosInstance.post<Photo>('/photos', request, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    return response.data;
  }

  async findMany(
    request: PhotoFindManyV1Dto,
  ): Promise<WrapperPaginationData<Photo[]>> {
    const response = await this.axiosInstance.get<Photo[]>('/photos');
    const rawPhotos = response.data;
    const offset = request.row * (request.page - 1);

    const result = rawPhotos.slice(offset, offset + request.row);

    const meta: PaginationMeta = {
      total_data: rawPhotos.length,
      total_view: result.length,
      max_view: request.row,
      current_page: request.page,
      total_page: Math.ceil(rawPhotos.length / request.row),
    };

    return paginationData(result, meta);
  }

  async findById(id: number): Promise<Photo> {
    const response = await this.axiosInstance.get(`/photos/${id}`);
    const photo = response.data;
    if (!photo) {
      throw new NotFoundException('Photo not found.');
    }

    return photo;
  }

  async updatePutById(
    request: PhotoUpdatePutV1Dto,
    id: number,
  ): Promise<Photo> {
    const response = await this.axiosInstance.put<Photo>(
      `/photos/${id}`,
      request,
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );

    return response.data;
  }

  async updatePatchById(
    request: PhotoUpdatePatchV1Dto,
    id: number,
  ): Promise<Photo> {
    const response = await this.axiosInstance.patch<Photo>(
      `/photos/${id}`,
      request,
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );

    return response.data;
  }

  async deleteById(id: number): Promise<void> {
    await this.axiosInstance.delete(`/photos/${id}`);
  }
}

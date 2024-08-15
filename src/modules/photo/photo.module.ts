import { Module } from '@nestjs/common';
import { PhotoV1Controller } from './controllers/photo-v1.controller';
import { PhotoV1Service } from './services/photo-v1.service';
import { PhotoV1UseCase } from './usecases/photo-v1.usecase';

@Module({
  controllers: [PhotoV1Controller],
  providers: [PhotoV1Service, PhotoV1UseCase],
})
export class PhotoModule {}

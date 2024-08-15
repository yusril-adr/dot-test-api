import { Test, TestingModule } from '@nestjs/testing';
import { PhotoV1Controller } from './photo-v1.controller';

describe('PhotoV1Controller', () => {
  let controller: PhotoV1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoV1Controller],
    }).compile();

    controller = module.get<PhotoV1Controller>(PhotoV1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

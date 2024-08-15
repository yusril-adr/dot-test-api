import { Test, TestingModule } from '@nestjs/testing';
import { PhotoV1Service } from './photo-v1.service';

describe('PhotoV1Service', () => {
  let service: PhotoV1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotoV1Service],
    }).compile();

    service = module.get<PhotoV1Service>(PhotoV1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

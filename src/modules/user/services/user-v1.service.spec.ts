import { Test, TestingModule } from '@nestjs/testing';
import { UserV1Service } from './user-v1.service';

describe('UserV1Service', () => {
  let service: UserV1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserV1Service],
    }).compile();

    service = module.get<UserV1Service>(UserV1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserV1Controller } from './user-v1.controller';

describe('UserV1Controller', () => {
  let controller: UserV1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserV1Controller],
    }).compile();

    controller = module.get<UserV1Controller>(UserV1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TodoV1Service } from './todo-v1.service';

describe('TodoV1Service', () => {
  let service: TodoV1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoV1Service],
    }).compile();

    service = module.get<TodoV1Service>(TodoV1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

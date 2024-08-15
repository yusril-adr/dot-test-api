import { Test, TestingModule } from '@nestjs/testing';
import { TodoV1Controller } from './todo-v1.controller';

describe('TodoV1Controller', () => {
  let controller: TodoV1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoV1Controller],
    }).compile();

    controller = module.get<TodoV1Controller>(TodoV1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Todo } from '@entities/todo.entity';

@Injectable()
export class TodoV1Service {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(
    data: Omit<Todo, 'id'> & {
      id?: number;
    },
  ): Promise<Todo> {
    const createdTodo = this.todoRepository.create(data);
    return await this.todoRepository.save(createdTodo);
  }

  async findAndCount(params: FindManyOptions<Todo>): Promise<[Todo[], number]> {
    return await this.todoRepository.findAndCount({
      ...params,
      relations: {
        user: true,
      },
      select: { user: { id: true, name: true, username: true } },
    });
  }

  async findById(id: number): Promise<Todo> {
    return await this.todoRepository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async findOne(params: Partial<Todo>): Promise<Todo> {
    return await this.todoRepository.findOne({ where: params });
  }

  async findByUserId(id: number): Promise<Todo> {
    return await this.todoRepository.findOne({
      relations: { user: true },
      where: { user: { id } },
    });
  }

  async updateById(id: number, payload: Omit<Todo, 'id'>): Promise<void> {
    await this.todoRepository.update({ id }, payload);
  }

  async saveToDb(data: Todo): Promise<Todo> {
    await this.todoRepository.save(data);
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}

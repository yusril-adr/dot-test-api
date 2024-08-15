import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from '@entities/todo.entity';
import { TodoV1Service } from '../services/todo-v1.service';
import { paginationData, WrapperPaginationData } from '@helpers/utils/wrapper';
import { TodoFindManyV1Dto } from '../dto/todo-find-many-v1.dto';
import { PaginationMeta } from '@helpers/types/pagination-meta.type';
import { TodoCreateV1Dto } from '../dto/todo-create-v1.dto';
import { UserV1Service } from '@modules/user/services/user-v1.service';
import { TodoUpdatePutV1Dto } from '../dto/todo-update-put-v1.dto';
import { TodoUpdatePatchV1Dto } from '../dto/todo-update-patch-v1.dto';

@Injectable()
export class TodoV1UseCase {
  constructor(
    private readonly userService: UserV1Service,
    private readonly todoService: TodoV1Service,
  ) {}

  async createTodo(request: TodoCreateV1Dto, userId: number): Promise<Todo> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }

    const createdTodo = await this.todoService.create({
      ...request,
      user,
    });

    return {
      ...createdTodo,
      user: undefined,
    };
  }

  async findMany(
    request: TodoFindManyV1Dto,
  ): Promise<WrapperPaginationData<Todo[]>> {
    const offset = request.row * (request.page - 1);
    const [result, count] = await this.todoService.findAndCount({
      where: { user: { id: request.user_id } },
      skip: offset,
      take: request.row,
    });

    const meta: PaginationMeta = {
      total_data: count,
      total_view: offset + result.length,
      max_view: result.length,
      current_page: request.page,
      total_page: Math.ceil(count / request.row),
    };

    return paginationData(result, meta);
  }

  async findById(id: number): Promise<Todo> {
    const todo = await this.todoService.findById(id);

    if (!todo) {
      throw new NotFoundException('To do not found.');
    }

    const formatedTodo = {
      ...todo,
      user: {
        ...todo.user,
        password: undefined,
      },
    };
    return formatedTodo;
  }

  async updatePutById(
    request: TodoUpdatePutV1Dto,
    id: number,
    userId: number,
  ): Promise<Todo> {
    const todo = await this.todoService.findById(id);

    if (!todo) {
      throw new NotFoundException('To do not found.');
    }

    if (userId !== todo.user.id) {
      throw new ForbiddenException('User is not the owner of todo.');
    }

    const updatedTodoPayload = {
      ...request,
      user: todo.user,
    };

    await this.todoService.updateById(id, updatedTodoPayload);

    const updatedTodo = await this.todoService.findById(id);

    return {
      ...updatedTodo,
      user: undefined,
    };
  }

  async updatePatchById(
    request: TodoUpdatePatchV1Dto,
    id: number,
    userId: number,
  ): Promise<Todo> {
    const todo = await this.todoService.findById(id);

    if (!todo) {
      throw new NotFoundException('To do not found.');
    }

    if (userId !== todo.user.id) {
      throw new ForbiddenException('User is not the owner of todo.');
    }

    const updatedTodoPayload = {
      ...todo,
      ...request,
    };

    await this.todoService.updateById(id, updatedTodoPayload);

    const updatedTodo = await this.todoService.findById(id);

    return {
      ...updatedTodo,
      user: undefined,
    };
  }

  async deleteById(id: number, userId: number): Promise<void> {
    const todo = await this.todoService.findById(id);

    if (!todo) {
      throw new NotFoundException('To do not found.');
    }

    if (userId !== todo.user.id) {
      throw new ForbiddenException('User is not the owner of todo.');
    }

    await this.todoService.delete(id);
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from '@entities/todo.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { TodoV1Service } from '../services/todo-v1.service';
import { paginationData, WrapperPaginationData } from '@helpers/utils/wrapper';
import { TodoFindManyV1Dto } from '../dto/todo-find-many-v1.dto';
import { PaginationMeta } from '@helpers/types/pagination-meta.type';
import { TodoCreateV1Dto } from '../dto/todo-create-v1.dto';
import { UserV1Service } from '@modules/user/services/user-v1.service';
import { TodoUpdatePutV1Dto } from '../dto/todo-update-put-v1.dto';
import { TodoUpdatePatchV1Dto } from '../dto/todo-update-patch-v1.dto';
import { CACHE_KEY } from '@helpers/constants/cache-key';

@Injectable()
export class TodoV1UseCase {
  private readonly logger = new Logger(TodoV1UseCase.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const cacheResult = await this.cacheManager.get<Todo>(
      `${CACHE_KEY.TODO_BY_ID}/${id}`,
    );

    if (cacheResult) {
      this.logger.debug(`Returning from cache for Todo with id: ${id}`);
      return cacheResult;
    }

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

    this.logger.debug(`adding to cache for Todo with id: ${id}`);
    await this.cacheManager.set(
      `${CACHE_KEY.TODO_BY_ID}/${id}`,
      formatedTodo,
      1000 * 60 * 3, // 3 Minutes
    );

    this.logger.debug(`Returning from db for Todo with id: ${id}`);
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

    this.logger.debug(`Deleting cache for Todo with id: ${id}`);
    await this.cacheManager.del(`${CACHE_KEY.TODO_BY_ID}/${id}`);

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

    this.logger.debug(`Deleting cache for Todo with id: ${id}`);
    await this.cacheManager.del(`${CACHE_KEY.TODO_BY_ID}/${id}`);

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

    this.logger.debug(`Deleting cache for Todo with id: ${id}`);
    await this.cacheManager.del(`${CACHE_KEY.TODO_BY_ID}/${id}`);
  }
}

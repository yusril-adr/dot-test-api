import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import * as wrapper from '@helpers/utils/wrapper';
import { Response } from '@helpers/types/response.type';
import { Todo } from '@entities/todo.entity';
import { TodoV1UseCase } from '../usecases/todo-v1.usecase';
import { TodoFindManyV1Dto } from '../dto/todo-find-many-v1.dto';
import { AccessTokenGuard } from '@helpers/guards/access-token.guards';
import { TodoCreateV1Dto } from '../dto/todo-create-v1.dto';
import { RequestUser } from '@helpers/types/request.type';
import { TodoUpdatePutV1Dto } from '../dto/todo-update-put-v1.dto';
import { TodoUpdatePatchV1Dto } from '../dto/todo-update-patch-v1.dto';

@Controller({ path: 'todos', version: '1' })
export class TodoV1Controller {
  constructor(private readonly todoUseCase: TodoV1UseCase) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async create(
    @Body() requestBody: TodoCreateV1Dto,
    @Request() request: RequestUser,
  ): Promise<Response<Todo>> {
    const result = await this.todoUseCase.createTodo(
      requestBody,
      request.user.id,
    );

    return wrapper.response({
      data: result,
      message: 'Create To do Success',
    });
  }

  @Get('')
  async findMany(
    @Query() request: TodoFindManyV1Dto,
  ): Promise<Response<Todo[]>> {
    const result = await this.todoUseCase.findMany(request);

    return wrapper.paginationResponse({
      ...result,
      message: 'Get Todo List Success',
    });
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<Response<Todo>> {
    const result = await this.todoUseCase.findById(id);

    return wrapper.response({
      data: result,
      message: 'Get Todo By Id Success',
    });
  }

  @Put('/:id')
  @UseGuards(AccessTokenGuard)
  async updatePutById(
    @Param('id') id: number,
    @Request() request: RequestUser,
    @Body() requestBody: TodoUpdatePutV1Dto,
  ): Promise<Response<Todo>> {
    const result = await this.todoUseCase.updatePutById(
      requestBody,
      id,
      request.user.id,
    );

    return wrapper.response({
      data: result,
      message: 'Update Put Todo By Id Success',
    });
  }

  @Patch('/:id')
  @UseGuards(AccessTokenGuard)
  async updatePatchById(
    @Param('id') id: number,
    @Request() request: RequestUser,
    @Body() requestBody: TodoUpdatePatchV1Dto,
  ): Promise<Response<Todo>> {
    const result = await this.todoUseCase.updatePatchById(
      requestBody,
      id,
      request.user.id,
    );

    return wrapper.response({
      data: result,
      message: 'Update Patch Todo By Id Success',
    });
  }

  @Delete('/:id')
  @UseGuards(AccessTokenGuard)
  async deleteById(
    @Param('id') id: number,
    @Request() request: RequestUser,
  ): Promise<Response<null>> {
    this.todoUseCase.deleteById(id, request.user.id);

    return wrapper.response({
      data: null,
      message: 'Delete Todo By Id Success',
    });
  }
}

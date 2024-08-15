import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoV1Controller } from './controllers/todo-v1.controller';
import { TodoV1Service } from './services/todo-v1.service';
import { TodoV1UseCase } from './usecases/todo-v1.usecase';
import { Todo } from '@entities/todo.entity';
import { UserModule } from '@modules/user/user.module';
import { UserV1Service } from '@modules/user/services/user-v1.service';
import { User } from '@entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User]), UserModule],
  controllers: [TodoV1Controller],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    TodoV1UseCase,
    TodoV1Service,
    UserV1Service,
  ],
})
export class TodoModule {}

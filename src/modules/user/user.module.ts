import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { UserV1Controller } from './controllers/user-v1.controller';
import { UserV1Service } from './services/user-v1.service';
import { UserV1UseCase } from './usecases/user-v1.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserV1Controller],
  providers: [UserV1UseCase, UserV1Service],
  exports: [UserV1Service],
})
export class UserModule {}

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { UserV1UseCase } from '../usecases/user-v1.usecase';
import { UserRegisterV1Dto } from '../dto/user-register-v1.dto';
import * as wrapper from '@helpers/utils/wrapper';
import { Response } from '@helpers/types/response.type';
import { User } from '@entities/user.entity';
import { UserLoginV1Dto } from '../dto/user-login-v1.dto';
import { AccessTokenGuard } from '@helpers/guards/access-token.guards';
import { RequestUser } from '@helpers/types/request.type';

@Controller({
  path: 'users',
  version: '1',
})
export class UserV1Controller {
  constructor(private readonly userV1UseCase: UserV1UseCase) {}

  @Post()
  async register(
    @Body() userRegisterV1Dto: UserRegisterV1Dto,
  ): Promise<Response<User>> {
    const result = await this.userV1UseCase.register(userRegisterV1Dto);

    return wrapper.response({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'Register Success',
    });
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() userLoginV1Dto: UserLoginV1Dto,
  ): Promise<Response<{ access_token: string }>> {
    const result = await this.userV1UseCase.login(userLoginV1Dto);

    return wrapper.response({
      data: result,
      message: 'Login Success',
    });
  }

  @Post('/login/token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async loginByToken(
    @Request() request: RequestUser,
  ): Promise<Response<Omit<User, 'password'>>> {
    const result = await this.userV1UseCase.loginByToken(request.token);

    return wrapper.response({
      data: result,
      message: 'Login By Token Success',
    });
  }

  @Get(':id')
  async findById(
    @Param('id') id: number,
  ): Promise<Response<Omit<User, 'password'>>> {
    const result = await this.userV1UseCase.findById(id);

    return wrapper.response({
      data: result,
      message: 'Find User By Id Success',
    });
  }
}

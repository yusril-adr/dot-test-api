import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as wrapper from '@helpers/utils/wrapper';
import { Response } from '@helpers/types/response.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  checkStatusRunning(): Response<string> {
    const message = this.appService.checkStatusRunning();
    return wrapper.response({ message });
  }
}

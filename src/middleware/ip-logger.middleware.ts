import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpLoggerMidlleware implements NestMiddleware {
  private readonly logger = new Logger(IpLoggerMidlleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    Logger.log(`IP: ${req.ip}, Path: ${req.path}`);
    next();
  }
}

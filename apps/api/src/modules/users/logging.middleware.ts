import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private readonly logger = new Logger(LoggingMiddleware.name);

    use(req: Request, _res: Response, next: NextFunction) {
        this.logger.log(`Request... Method: ${req.method}, URL: ${req.url}`);
        next();
    }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const response = context.switchToHttp().getResponse();
                    const delay = Date.now() - now;
                    this.logger.log(`${method} ${url} ${response.statusCode} ${delay}ms - Success`);
                    if (process.env['NODE_ENV'] === 'development') {
                        this.logger.debug('Request Body:', body);
                        this.logger.debug('Response Data:', data);
                    }
                },
                error: (error) => {
                    const delay = Date.now() - now;
                    this.logger.error(`${method} ${url} - Error: ${error.message} (${delay}ms)`, error.stack);
                },
            }),
        );
    }
}

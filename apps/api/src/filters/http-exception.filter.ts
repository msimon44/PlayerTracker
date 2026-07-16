import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

interface ErrorDetails {
    invalidField?: string;
    allowedFields?: string[];
    originalError?: string;
    code?: string;
    field?: string[];
    cause?: string;
    [key: string]: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let details: ErrorDetails | null = null;

        // Handle Prisma Errors
        if (exception instanceof Prisma.PrismaClientValidationError) {
            status = HttpStatus.BAD_REQUEST;
            // Extract the field name from the error message
            const errorMessage = exception.message;
            const fieldMatch = /Unknown argument `(\w+)`/.exec(errorMessage);
            if (fieldMatch?.[1]) {
                message = `Invalid field: ${fieldMatch[1]} is not allowed`;
                details = {
                    invalidField: fieldMatch[1],
                    allowedFields: this.extractAllowedFields(errorMessage),
                };
            } else {
                message = 'Invalid data structure provided';
                details = { originalError: errorMessage };
            }
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            status = HttpStatus.BAD_REQUEST;
            const errorInfo = this.getPrismaErrorInfo(exception);
            message = errorInfo.message;
            details = errorInfo.details;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
            const response = exception.getResponse();
            if (typeof response === 'object') {
                details = response as ErrorDetails;
            }
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message,
            ...(details && { details }),
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `\n🔴 ERREUR FATALE 🔴\n📍 ${request.method} ${request.url}\n💥 ${message}\n`,
                exception instanceof Error ? exception.stack : 'Unknown error',
            );
        } else {
            this.logger.warn(
                `\n🟠 REQUÊTE ERRONÉE 🟠\n📍 ${request.method} ${request.url}\n⚠️ Status: ${status}\n📝 Message: ${message}\n🔍 Details: ${JSON.stringify(details, null, 2)}\n`,
            );

            if (request.body && Object.keys(request.body).length > 0) {
                this.logger.warn(`📦 Body: ${JSON.stringify(request.body, null, 2)}`);
            }
        }

        response.status(status).json(errorResponse);
    }

    private getPrismaErrorInfo(error: Prisma.PrismaClientKnownRequestError): {
        message: string;
        details: ErrorDetails;
    } {
        switch (error.code) {
            case 'P2002':
                return {
                    message: 'A unique constraint would be violated.',
                    details: {
                        code: error.code,
                        field: error.meta?.['target'] as string[],
                    },
                };
            case 'P2025':
                return {
                    message: 'Record not found.',
                    details: {
                        code: error.code,
                        cause: error.meta?.['cause'] as string,
                    },
                };
            case 'P2014':
                return {
                    message: 'The change you are trying to make would violate the required relation.',
                    details: {
                        code: error.code,
                        ...(error.meta as object),
                    },
                };
            default:
                return {
                    message: 'Database error occurred.',
                    details: {
                        code: error.code,
                        ...(error.meta as object),
                    },
                };
        }
    }

    private extractAllowedFields(errorMessage: string): string[] {
        const availableOptionsMatch = /Available options are marked with \?\..*?\{([^}]+)\}/s.exec(errorMessage);
        if (availableOptionsMatch && availableOptionsMatch[1]) {
            return availableOptionsMatch[1]
                .split('\n')
                .map((line) => {
                    const fieldMatch = /\s*(\w+)\??:/.exec(line);
                    return fieldMatch ? fieldMatch[1] : null;
                })
                .filter((field): field is string => field !== null);
        }
        return [];
    }
}

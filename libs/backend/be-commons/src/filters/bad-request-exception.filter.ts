import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse() as
            | string
            | { message: any; error: string };

        let customResponse = {};

        if (typeof exceptionResponse === 'object' && exceptionResponse.hasOwnProperty('message')) {
            const { message } = exceptionResponse;
            customResponse = {
                statusCode: status,
                error: 'Validation Error',
                message: message, // You can format the message differently here
                timestamp: new Date().toISOString(),
            };
        } else {
            customResponse = exceptionResponse;
        }

        response.status(status).json(customResponse);
    }
}

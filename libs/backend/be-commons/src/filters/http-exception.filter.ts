import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpValidationException } from '../exceptions';
import {
  ValidationErrors,
  ErrorResponseDTO,
} from '@workspace/commons/dtos/error-response/validation-error.response';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let errors: ValidationErrors | undefined;
    // console.log('HttpExceptionFilter caught exception:', (exception as HttpValidationException).errors);
    if ((exception as HttpValidationException).errors?.length) {
      errors = {};
      (exception as HttpValidationException).errors?.forEach((e) => {
        errors![e.property] = {
          message: (e.errors ?? Object.values(e.constraints ?? {}))?.join(', '),
        };
      });
    }
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      statusText: 'REQUEST_FAILED',
      message: exception.message,
      errors,
      error: exception.message,
      __isError: true,
    } as ErrorResponseDTO);
  }
}

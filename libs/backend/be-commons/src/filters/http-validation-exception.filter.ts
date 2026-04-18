import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {
  ErrorResponseDTO,
  ValidationErrors,
} from '@workspace/commons/dtos/error-response/validation-error.response';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import { HttpValidationException } from '../exceptions';
@Catch(HttpValidationException)
export class HttpValidationFilter implements ExceptionFilter {
  public catch(exception: HttpValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let errors: ValidationErrors | undefined;
    if (exception.errors?.length) {
      errors = {};
      exception.errors?.forEach((e: ValidationError) => {
        errors![e.property] = {
          message: Object.values(e.constraints ?? {})?.join(', '),
        };
      });
    }
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      timestamp: new Date().toISOString(),
      path: request.url,
      statusText: 'VALIDATION_FAILED',
      message: exception.message,
      errors,
      error: exception.message,
      __isError: true,
    } as ErrorResponseDTO);
  }
}

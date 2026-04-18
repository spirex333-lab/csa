import { Injectable, ValidationPipe } from '@nestjs/common';
import { HttpValidationException } from '../exceptions';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  override createExceptionFactory() {
    return (validationErrors = []) => {
      return new HttpValidationException(validationErrors, 'Bad request');
    };
  }
}

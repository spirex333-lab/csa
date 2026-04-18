import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class HttpValidationException extends HttpException {
  constructor(
    public errors: (ValidationError & { errors?: string[] })[],
    override readonly message: string
  ) {
    super(message, 400);
  }
}

import { BaseDTO } from '../base.dto';

export type ValidationErrors = Record<string, { message: string }>;

export class ErrorResponseDTO<
  VE = ValidationErrors
> extends BaseDTO<ErrorResponseDTO> {
  public statusCode!: number;
  public timestamp!: string;
  public path!: string;
  public statusText!: string;
  public message!: string;
  public errors?: VE;
  public error!: string;
  public __isError!: boolean;
}

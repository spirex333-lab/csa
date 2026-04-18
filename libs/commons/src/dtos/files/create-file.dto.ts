import { BaseDTO } from '../base.dto';

export class CreateFileDTO extends BaseDTO<CreateFileDTO> {
  originalName!: string;

  path!: string;

  size!: number;

  mimeType!: string;
}

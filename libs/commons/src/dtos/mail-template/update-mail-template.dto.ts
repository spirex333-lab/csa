import { CreateMailTemplateDTO } from './create-mail-template.dto';

export class UpdateMailTemplateDTO extends CreateMailTemplateDTO {
  public html!: string;
}

import { CreateUploadLinkDTO } from './create-upload-link.dto';

export class UploadLinkDTO extends CreateUploadLinkDTO {
  public key!: string;
}

import { CreateApiKeyDTO } from "./create-api-key.dto";

export class ApiKeyDTO extends CreateApiKeyDTO {

    public key?: string;
    public isActive?: boolean;
}
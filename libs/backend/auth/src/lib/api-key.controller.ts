import { Controller, Inject } from '@nestjs/common';
import { CRUDController } from '@workspace/be-commons';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDTO } from '@workspace/commons/dtos/api-keys/create-api-key.dto';

@Controller('api-keys')
export class ApiKeyController extends CRUDController<
  CreateApiKeyDTO,
  ApiKeyService
> {
  constructor(
    @Inject(ApiKeyService)
    private readonly apiKeyService: ApiKeyService
  ) {
    super(apiKeyService, CreateApiKeyDTO);
  }
}

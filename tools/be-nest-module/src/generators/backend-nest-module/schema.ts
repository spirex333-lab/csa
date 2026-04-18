export interface BackendNestModuleGeneratorSchema {
  name: string;
  directory?: string;
  route?: string;
  entity?: string;
  entityImportPath?: string;
  dtoName?: string;
  dtoImportPath?: string;
  createDtoName?: string;
  createDtoImportPath?: string;
  updateDtoName?: string;
  updateDtoImportPath?: string;
  relatedEntity?: string;
  relatedEntityImportPath?: string;
  relatedEntityField?: string;
  relatedEntityIdProperty?: string;
  importAlias?: string;
}

import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  offsetFromRoot,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import type { BackendNestModuleGeneratorSchema } from './schema';

const ENTITY_ALIAS = '@workspace/be-commons/entities';
const ENTITY_BASE_PATH = 'libs/backend/be-commons/src/entities';
const DTO_ALIAS = '@workspace/commons/dtos';
const DTO_BASE_PATH = 'libs/commons/src/dtos';

interface NormalizedSchema extends BackendNestModuleGeneratorSchema {
  projectName: string;
  projectDirectory: string;
  projectRoot: string;
  sourceRoot: string;
  fileName: string;
  className: string;
  propertyName: string;
  route: string;
  entityName: string;
  entityImportPath: string;
  entityFileName: string;
  entityDirectoryPath?: string;
  entityWorkspacePath?: string;
  dtoName: string;
  dtoImportPath: string;
  dtoBaseFileName: string;
  dtoDirectoryPath?: string;
  dtoWorkspacePath?: string;
  createDtoName: string;
  createDtoImportPath: string;
  updateDtoName: string;
  updateDtoImportPath: string;
  relatedEntityName?: string;
  relatedEntityImportPath?: string;
  relatedEntityField?: string;
  relatedEntityIdProperty?: string;
  importAlias: string;
}

interface AliasedImportResolution {
  directory: string;
  workspacePath: string;
  fileSegment: string;
  fileBase: string;
  relativeDir: string;
}

function resolveAliasedImport(
  importPath: string,
  alias: string,
  workspaceBase: string
): AliasedImportResolution | null {
  if (!importPath.startsWith(alias)) {
    return null;
  }

  const remainder = importPath.slice(alias.length).replace(/^\/+/, '');
  const segments = remainder.split('/').filter(Boolean);

  if (segments.length === 0) {
    return {
      directory: workspaceBase,
      workspacePath: joinPathFragments(workspaceBase, 'index.ts'),
      fileSegment: 'index',
      fileBase: 'index',
      relativeDir: '',
    };
  }

  const fileSegment = segments.pop() ?? '';
  const relativeDir = segments.join('/');
  const directory = segments.length
    ? joinPathFragments(workspaceBase, ...segments)
    : workspaceBase;

  const workspacePath = joinPathFragments(directory, `${fileSegment}.ts`);
  const fileBase = fileSegment.replace(/\.[^.]+$/, '');

  return {
    directory,
    workspacePath,
    fileSegment,
    fileBase,
    relativeDir,
  };
}

function normalizeOptions(
  tree: Tree,
  options: BackendNestModuleGeneratorSchema
): NormalizedSchema {
  if (!options.name?.trim()) {
    throw new Error('The `name` option is required.');
  }

  const nameVariants = names(options.name);
  const directorySegments = options.directory
    ? names(options.directory).fileName
    : '';
  const projectDirectory = directorySegments
    ? joinPathFragments(directorySegments, nameVariants.fileName)
    : nameVariants.fileName;
  const projectRoot = joinPathFragments('libs/backend', projectDirectory);

  if (tree.exists(projectRoot)) {
    throw new Error(`Project directory ${projectRoot} already exists.`);
  }

  const projectName = projectDirectory.replace(/\//g, '-');
  const sourceRoot = joinPathFragments(projectRoot, 'src');
  const route = options.route ?? nameVariants.fileName;

  const entityName = options.entity ?? nameVariants.className;
  const entityImportPath =
    options.entityImportPath ??
    `@workspace/be-commons/entities/${names(entityName).fileName}.entity`;

  const dtoName = options.dtoName ?? `${nameVariants.className}Dto`;
  const dtoClassBase = dtoName.endsWith('Dto')
    ? dtoName.slice(0, -3)
    : dtoName;
  const dtoImportPath =
    options.dtoImportPath ??
    `@workspace/commons/dtos/${nameVariants.fileName}/${nameVariants.fileName}.dto`;
  const dtoImportDirectory = dtoImportPath.includes('/')
    ? dtoImportPath.slice(0, dtoImportPath.lastIndexOf('/'))
    : dtoImportPath;
  const dtoFileSegmentFromImport = dtoImportPath.split('/').pop() ??
    `${nameVariants.fileName}.dto`;
  const dtoBaseFileName = dtoFileSegmentFromImport.replace(/\.[^.]+$/, '');

  const createDtoName =
    options.createDtoName ?? `Create${dtoClassBase}Dto`;
  const createDtoImportPath =
    options.createDtoImportPath ??
    `${dtoImportDirectory}/create-${dtoBaseFileName}.dto`;

  const updateDtoName =
    options.updateDtoName ?? `Update${dtoClassBase}Dto`;
  const updateDtoImportPath =
    options.updateDtoImportPath ??
    `${dtoImportDirectory}/update-${dtoBaseFileName}.dto`;

  const relatedEntityName = options.relatedEntity?.trim()
    ? options.relatedEntity
    : undefined;
  const relatedEntityImportPath = relatedEntityName
    ? options.relatedEntityImportPath ??
      `${ENTITY_ALIAS}/${names(relatedEntityName).fileName}.entity`
    : undefined;
  const relatedEntityField = relatedEntityName
    ? options.relatedEntityField ?? names(relatedEntityName).propertyName
    : undefined;
  const relatedEntityIdProperty = relatedEntityField
    ? options.relatedEntityIdProperty ?? `${relatedEntityField}Id`
    : undefined;

  const entityImportInfo = resolveAliasedImport(
    entityImportPath,
    ENTITY_ALIAS,
    ENTITY_BASE_PATH
  );
  const entityFileSegment = entityImportInfo?.fileSegment ??
    `${names(entityName).fileName}.entity`;
  const entityFileName = entityFileSegment.replace(/\.entity$/, '');
  const entityDirectoryPath = entityImportInfo?.directory ?? ENTITY_BASE_PATH;
  const entityWorkspacePath = joinPathFragments(
    entityDirectoryPath,
    `${entityFileSegment}.ts`
  );

  const dtoImportInfo = resolveAliasedImport(
    dtoImportPath,
    DTO_ALIAS,
    DTO_BASE_PATH
  );
  const dtoDirectoryPath = dtoImportInfo?.directory;
  const dtoWorkspacePath = dtoImportInfo?.workspacePath;

  const importAlias =
    options.importAlias ??
    `@workspace/${
      directorySegments
        ? `${directorySegments.replace(/\\/g, '/')}/${nameVariants.fileName}`
        : nameVariants.fileName
    }`;

  return {
    ...options,
    projectName,
    projectDirectory,
    projectRoot,
    sourceRoot,
    fileName: nameVariants.fileName,
    className: nameVariants.className,
    propertyName: nameVariants.propertyName,
    route,
    entityName,
    entityImportPath,
    entityFileName,
    entityDirectoryPath,
    entityWorkspacePath,
    dtoName,
    dtoImportPath,
    dtoBaseFileName,
    dtoDirectoryPath,
    dtoWorkspacePath,
    createDtoName,
    createDtoImportPath,
    updateDtoName,
    updateDtoImportPath,
    relatedEntityName,
    relatedEntityImportPath,
    relatedEntityField,
    relatedEntityIdProperty,
    importAlias,
  };
}

function updateTsConfig(tree: Tree, normalizedOptions: NormalizedSchema) {
  const { importAlias, projectRoot } = normalizedOptions;
  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions ??= {} as any;
    json.compilerOptions.paths ??= {} as any;

    if (!json.compilerOptions.paths[importAlias]) {
      json.compilerOptions.paths[importAlias] = [
        joinPathFragments(projectRoot, 'src/index.ts'),
      ];
    }

    const starAlias = `${importAlias}/*`;
    if (!json.compilerOptions.paths[starAlias]) {
      json.compilerOptions.paths[starAlias] = [
        joinPathFragments(projectRoot, 'src/*'),
      ];
    }

    return json;
  });
}

function createProjectFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
    ...options,
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

function ensureEntityFiles(tree: Tree, options: NormalizedSchema) {
  if (!options.entityDirectoryPath || !options.entityWorkspacePath) {
    return;
  }

  if (!tree.exists(options.entityWorkspacePath)) {
    const templateOptions = {
      tmpl: '',
      entityFileName: options.entityFileName,
      entityName: options.entityName,
    };

    generateFiles(
      tree,
      path.join(__dirname, 'partials', 'entities'),
      options.entityDirectoryPath,
      templateOptions
    );
  }

  const indexPath = joinPathFragments(options.entityDirectoryPath, 'index.ts');
  const exportLine = `export * from './${options.entityFileName}.entity';`;
  const existingIndex = tree.exists(indexPath)
    ? tree.read(indexPath)?.toString() ?? ''
    : '';

  if (!existingIndex.includes(exportLine)) {
    const content = existingIndex.trimEnd();
    const updated = content ? `${content}\n${exportLine}\n` : `${exportLine}\n`;
    tree.write(indexPath, updated);
  }
}

function ensureDtoFiles(tree: Tree, options: NormalizedSchema) {
  if (!options.dtoDirectoryPath || !options.dtoWorkspacePath) {
    return;
  }

  if (!tree.exists(options.dtoWorkspacePath)) {
    const templateOptions = {
      tmpl: '',
      dtoBaseFileName: options.dtoBaseFileName,
      dtoName: options.dtoName,
      createDtoName: options.createDtoName,
      updateDtoName: options.updateDtoName,
      relatedEntityIdProperty: options.relatedEntityIdProperty,
    };

    generateFiles(
      tree,
      path.join(__dirname, 'partials', 'dtos'),
      options.dtoDirectoryPath,
      templateOptions
    );
  }
}

export async function backendNestModuleGenerator(
  tree: Tree,
  options: BackendNestModuleGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  createProjectFiles(tree, normalizedOptions);
  ensureEntityFiles(tree, normalizedOptions);
  ensureDtoFiles(tree, normalizedOptions);
  updateTsConfig(tree, normalizedOptions);

  await formatFiles(tree);
}

export default backendNestModuleGenerator;

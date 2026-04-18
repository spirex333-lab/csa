import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import { backendNestModuleGenerator } from './backend-nest-module';
import type { BackendNestModuleGeneratorSchema } from './schema';

describe('backendNestModule generator', () => {
  let tree: Tree;
  const options: BackendNestModuleGeneratorSchema = {
    name: 'sample',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    tree.write('tsconfig.base.json', JSON.stringify({ compilerOptions: { paths: {} } }));
  });

  it('should generate module files', async () => {
    await backendNestModuleGenerator(tree, options);

    expect(tree.exists('libs/backend/sample/project.json')).toBeTruthy();
    expect(tree.read('libs/backend/sample/src/lib/sample.module.ts')).toBeDefined();
  });

  it('should register tsconfig path aliases', async () => {
    await backendNestModuleGenerator(tree, options);

    const tsconfigRaw = tree.read('tsconfig.base.json')?.toString();
    expect(tsconfigRaw).toBeDefined();
    const tsconfig = JSON.parse(tsconfigRaw as string);

    expect(tsconfig.compilerOptions.paths['@workspace/sample']).toEqual([
      'libs/backend/sample/src/index.ts',
    ]);
    expect(tsconfig.compilerOptions.paths['@workspace/sample/*']).toEqual([
      'libs/backend/sample/src/*',
    ]);
  });
});

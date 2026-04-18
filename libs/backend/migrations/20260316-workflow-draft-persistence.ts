import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class WorkflowDraftPersistence2026031600000 implements MigrationInterface {
  name = 'WorkflowDraftPersistence2026031600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasWorkflowDefinition = await queryRunner.hasTable('workflow_definition');
    if (!hasWorkflowDefinition) {
      await queryRunner.createTable(
        new Table({
          name: 'workflow_definition',
          columns: [
            { name: 'id', type: 'serial', isPrimary: true },
            { name: 'name', type: 'character varying', length: '256' },
            { name: 'isDraft', type: 'boolean', default: 'true' },
            { name: 'workspace', type: 'character varying', length: '128', isNullable: true },
            { name: 'tenantId', type: 'integer', isNullable: true },
            { name: 'createdById', type: 'integer', isNullable: true },
            { name: 'createdAt', type: 'TIMESTAMP', default: 'now()' },
            { name: 'updatedAt', type: 'TIMESTAMP', default: 'now()' },
          ],
        })
      );

      await queryRunner.createForeignKeys('workflow_definition', [
        new TableForeignKey({ name: 'fk_workflow_definition_tenant', columnNames: ['tenantId'], referencedTableName: 'user', referencedColumnNames: ['id'], onDelete: 'SET NULL' }),
        new TableForeignKey({ name: 'fk_workflow_definition_created_by', columnNames: ['createdById'], referencedTableName: 'user', referencedColumnNames: ['id'], onDelete: 'SET NULL' }),
      ]);

      await queryRunner.createIndices('workflow_definition', [
        new TableIndex({ name: 'idx_workflow_definition_tenant_workspace', columnNames: ['tenantId', 'workspace'] }),
      ]);
    }

    const hasDraftVersion = await queryRunner.hasTable('workflow_draft_version');
    if (!hasDraftVersion) {
      await queryRunner.createTable(
        new Table({
          name: 'workflow_draft_version',
          columns: [
            { name: 'id', type: 'serial', isPrimary: true },
            { name: 'workflowId', type: 'integer' },
            { name: 'version', type: 'integer', default: '1' },
            { name: 'nodes', type: 'jsonb', default: "'[]'::jsonb" },
            { name: 'edges', type: 'jsonb', default: "'[]'::jsonb" },
            { name: 'viewport', type: 'jsonb', isNullable: true },
            { name: 'workspace', type: 'character varying', length: '128', isNullable: true },
            { name: 'tenantId', type: 'integer', isNullable: true },
            { name: 'createdById', type: 'integer', isNullable: true },
            { name: 'createdAt', type: 'TIMESTAMP', default: 'now()' },
            { name: 'updatedAt', type: 'TIMESTAMP', default: 'now()' },
          ],
        })
      );

      await queryRunner.createForeignKeys('workflow_draft_version', [
        new TableForeignKey({ name: 'fk_workflow_draft_workflow', columnNames: ['workflowId'], referencedTableName: 'workflow_definition', referencedColumnNames: ['id'], onDelete: 'CASCADE' }),
        new TableForeignKey({ name: 'fk_workflow_draft_tenant', columnNames: ['tenantId'], referencedTableName: 'user', referencedColumnNames: ['id'], onDelete: 'SET NULL' }),
        new TableForeignKey({ name: 'fk_workflow_draft_created_by', columnNames: ['createdById'], referencedTableName: 'user', referencedColumnNames: ['id'], onDelete: 'SET NULL' }),
      ]);

      await queryRunner.createIndices('workflow_draft_version', [
        new TableIndex({ name: 'idx_workflow_draft_workflow_version', columnNames: ['workflowId', 'version'] }),
        new TableIndex({ name: 'idx_workflow_draft_tenant_workspace', columnNames: ['tenantId', 'workspace'] }),
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('workflow_draft_version')) {
      await queryRunner.dropTable('workflow_draft_version', true);
    }
    if (await queryRunner.hasTable('workflow_definition')) {
      await queryRunner.dropTable('workflow_definition', true);
    }
  }
}

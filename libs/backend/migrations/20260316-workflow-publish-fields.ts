import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class WorkflowPublishFields2026031601000 implements MigrationInterface {
  name = 'WorkflowPublishFields2026031601000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('workflow_definition')) {
      if (!(await queryRunner.hasColumn('workflow_definition', 'publishedAt'))) {
        await queryRunner.addColumn('workflow_definition', new TableColumn({ name: 'publishedAt', type: 'TIMESTAMP', isNullable: true }));
      }
      if (!(await queryRunner.hasColumn('workflow_definition', 'publishedById'))) {
        await queryRunner.addColumn('workflow_definition', new TableColumn({ name: 'publishedById', type: 'integer', isNullable: true }));
      }
      const table = await queryRunner.getTable('workflow_definition');
      if (table && !table.foreignKeys.find((f) => f.name === 'fk_workflow_definition_published_by')) {
        await queryRunner.createForeignKey('workflow_definition', new TableForeignKey({
          name: 'fk_workflow_definition_published_by',
          columnNames: ['publishedById'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }));
      }
    }

    if (await queryRunner.hasTable('workflow_draft_version')) {
      if (!(await queryRunner.hasColumn('workflow_draft_version', 'isPublished'))) {
        await queryRunner.addColumn('workflow_draft_version', new TableColumn({ name: 'isPublished', type: 'boolean', default: 'false' }));
      }
      if (!(await queryRunner.hasColumn('workflow_draft_version', 'publishedAt'))) {
        await queryRunner.addColumn('workflow_draft_version', new TableColumn({ name: 'publishedAt', type: 'TIMESTAMP', isNullable: true }));
      }
      if (!(await queryRunner.hasColumn('workflow_draft_version', 'publishedById'))) {
        await queryRunner.addColumn('workflow_draft_version', new TableColumn({ name: 'publishedById', type: 'integer', isNullable: true }));
      }
      const table = await queryRunner.getTable('workflow_draft_version');
      if (table && !table.foreignKeys.find((f) => f.name === 'fk_workflow_draft_published_by')) {
        await queryRunner.createForeignKey('workflow_draft_version', new TableForeignKey({
          name: 'fk_workflow_draft_published_by',
          columnNames: ['publishedById'],
          referencedTableName: 'user',
          referencedColumnNames: ['id'],
          onDelete: 'SET NULL',
        }));
      }
      if (table && !table.indices.find((i) => i.name === 'idx_workflow_draft_published')) {
        await queryRunner.createIndex('workflow_draft_version', new TableIndex({ name: 'idx_workflow_draft_published', columnNames: ['workflowId', 'isPublished'] }));
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('workflow_draft_version')) {
      const table = await queryRunner.getTable('workflow_draft_version');
      const idx = table?.indices.find((i) => i.name === 'idx_workflow_draft_published');
      if (idx) await queryRunner.dropIndex('workflow_draft_version', idx);
      const fk = table?.foreignKeys.find((f) => f.name === 'fk_workflow_draft_published_by');
      if (fk) await queryRunner.dropForeignKey('workflow_draft_version', fk);
      if (await queryRunner.hasColumn('workflow_draft_version', 'publishedById')) await queryRunner.dropColumn('workflow_draft_version', 'publishedById');
      if (await queryRunner.hasColumn('workflow_draft_version', 'publishedAt')) await queryRunner.dropColumn('workflow_draft_version', 'publishedAt');
      if (await queryRunner.hasColumn('workflow_draft_version', 'isPublished')) await queryRunner.dropColumn('workflow_draft_version', 'isPublished');
    }
    if (await queryRunner.hasTable('workflow_definition')) {
      const table = await queryRunner.getTable('workflow_definition');
      const fk = table?.foreignKeys.find((f) => f.name === 'fk_workflow_definition_published_by');
      if (fk) await queryRunner.dropForeignKey('workflow_definition', fk);
      if (await queryRunner.hasColumn('workflow_definition', 'publishedById')) await queryRunner.dropColumn('workflow_definition', 'publishedById');
      if (await queryRunner.hasColumn('workflow_definition', 'publishedAt')) await queryRunner.dropColumn('workflow_definition', 'publishedAt');
    }
  }
}

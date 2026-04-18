import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddTenantWorkspaceColumns2026031500000 implements MigrationInterface {
  name = 'AddTenantWorkspaceColumns2026031500000';

  private readonly coreTables = [
    'user',
    'role',
    'api_key',
    'file',
    'tenant_memberships',
    'chat',
    'chat_group',
    'aibot',
    'matrix',
    'msg_queue',
    'crawler',
    'crawl_request',
    'test',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const tableName of this.coreTables) {
      const hasTable = await queryRunner.hasTable(tableName);
      if (!hasTable) continue;

      const hasTenant = await queryRunner.hasColumn(tableName, 'tenantId');
      if (!hasTenant) {
        await queryRunner.addColumn(
          tableName,
          new TableColumn({
            name: 'tenantId',
            type: 'integer',
            isNullable: true,
          })
        );
      }

      const hasWorkspace = await queryRunner.hasColumn(tableName, 'workspace');
      if (!hasWorkspace) {
        await queryRunner.addColumn(
          tableName,
          new TableColumn({
            name: 'workspace',
            type: 'character varying',
            length: '128',
            isNullable: true,
          })
        );
      }

      const table = await queryRunner.getTable(tableName);
      if (!table) continue;

      const tenantFkName = `fk_${tableName}_tenant_id_user`;
      const hasTenantFk = table.foreignKeys.some((fk) => fk.name === tenantFkName);
      if (!hasTenantFk) {
        await queryRunner.createForeignKey(
          tableName,
          new TableForeignKey({
            name: tenantFkName,
            columnNames: ['tenantId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          })
        );
      }

      const tenantIdxName = `idx_${tableName}_tenant_id`;
      const hasTenantIdx = table.indices.some((idx) => idx.name === tenantIdxName);
      if (!hasTenantIdx) {
        await queryRunner.createIndex(
          tableName,
          new TableIndex({
            name: tenantIdxName,
            columnNames: ['tenantId'],
          })
        );
      }

      const tenantWorkspaceIdxName = `idx_${tableName}_tenant_workspace`;
      const hasTenantWorkspaceIdx = table.indices.some(
        (idx) => idx.name === tenantWorkspaceIdxName
      );
      if (!hasTenantWorkspaceIdx) {
        await queryRunner.createIndex(
          tableName,
          new TableIndex({
            name: tenantWorkspaceIdxName,
            columnNames: ['tenantId', 'workspace'],
          })
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const tableName of this.coreTables) {
      const hasTable = await queryRunner.hasTable(tableName);
      if (!hasTable) continue;

      const table = await queryRunner.getTable(tableName);
      if (!table) continue;

      const tenantWorkspaceIdxName = `idx_${tableName}_tenant_workspace`;
      const tenantWorkspaceIdx = table.indices.find(
        (idx) => idx.name === tenantWorkspaceIdxName
      );
      if (tenantWorkspaceIdx) {
        await queryRunner.dropIndex(tableName, tenantWorkspaceIdx);
      }

      const tenantIdxName = `idx_${tableName}_tenant_id`;
      const tenantIdx = table.indices.find((idx) => idx.name === tenantIdxName);
      if (tenantIdx) {
        await queryRunner.dropIndex(tableName, tenantIdx);
      }

      const tenantFkName = `fk_${tableName}_tenant_id_user`;
      const tenantFk = table.foreignKeys.find((fk) => fk.name === tenantFkName);
      if (tenantFk) {
        await queryRunner.dropForeignKey(tableName, tenantFk);
      }

      const hasWorkspace = await queryRunner.hasColumn(tableName, 'workspace');
      if (hasWorkspace) {
        await queryRunner.dropColumn(tableName, 'workspace');
      }

      const hasTenant = await queryRunner.hasColumn(tableName, 'tenantId');
      if (hasTenant) {
        await queryRunner.dropColumn(tableName, 'tenantId');
      }
    }
  }
}

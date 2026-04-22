import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders20260422 implements MigrationInterface {
  name = 'CreateOrders20260422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` varchar(36) NOT NULL,
        \`fromCanonical\` varchar(20) NOT NULL,
        \`toCanonical\` varchar(20) NOT NULL,
        \`fromAmount\` decimal(20,8) NOT NULL,
        \`expectedToAmount\` decimal(20,8) NULL,
        \`depositAddress\` varchar(255) NOT NULL,
        \`toAddress\` varchar(255) NOT NULL,
        \`status\` varchar(32) NOT NULL DEFAULT 'awaiting_deposit',
        \`rateType\` varchar(10) NOT NULL DEFAULT 'float',
        \`provider\` varchar(32) NOT NULL,
        \`externalId\` varchar(100) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`tenantId\` varchar(36) NULL,
        \`workspace\` varchar(128) NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_orders_externalId\` (\`externalId\`),
        INDEX \`IDX_orders_status\` (\`status\`),
        INDEX \`IDX_orders_tenantId\` (\`tenantId\`),
        CONSTRAINT \`FK_orders_tenant\` FOREIGN KEY (\`tenantId\`)
          REFERENCES \`user\` (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    // Add nullable FK from order_events to the new orders table so lifecycle
    // events can reference the internal order record, not just the provider record.
    await queryRunner.query(`
      ALTER TABLE \`order_events\`
        ADD COLUMN IF NOT EXISTS \`internalOrderId\` varchar(36) NULL,
        ADD INDEX \`IDX_order_events_internalOrderId\` (\`internalOrderId\`),
        ADD CONSTRAINT \`FK_order_events_internal_order\`
          FOREIGN KEY (\`internalOrderId\`) REFERENCES \`orders\` (\`id\`) ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`order_events\`
        DROP FOREIGN KEY \`FK_order_events_internal_order\`,
        DROP INDEX \`IDX_order_events_internalOrderId\`,
        DROP COLUMN \`internalOrderId\`
    `);
    await queryRunner.query(`DROP TABLE IF EXISTS \`orders\``);
  }
}

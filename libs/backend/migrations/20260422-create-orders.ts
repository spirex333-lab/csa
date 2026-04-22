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
        INDEX \`IDX_orders_status\` (\`status\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`orders\``);
  }
}

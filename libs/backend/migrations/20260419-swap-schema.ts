import { MigrationInterface, QueryRunner } from 'typeorm';

export class SwapSchema20260419 implements MigrationInterface {
  name = 'SwapSchema20260419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`order_events\` (
        \`id\` varchar(36) NOT NULL,
        \`eventType\` varchar(64) NOT NULL,
        \`payload\` json NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`orderId\` varchar(36) NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_order_events_orderId\` (\`orderId\`),
        CONSTRAINT \`FK_order_events_order\` FOREIGN KEY (\`orderId\`)
          REFERENCES \`change_now_orders\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`supported_assets\` (
        \`id\` varchar(36) NOT NULL,
        \`ticker\` varchar(20) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`network\` varchar(50) NOT NULL,
        \`logoUrl\` varchar(500) NULL,
        \`minAmount\` decimal(20,8) NULL,
        \`maxAmount\` decimal(20,8) NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`lastSyncedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_supported_assets_ticker\` (\`ticker\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`affiliate_codes\` (
        \`id\` varchar(36) NOT NULL,
        \`code\` varchar(64) NOT NULL,
        \`ownerLabel\` varchar(255) NULL,
        \`revenueSharePct\` decimal(5,2) NOT NULL DEFAULT 0,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_affiliate_codes_code\` (\`code\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`affiliate_codes\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`supported_assets\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`order_events\``);
  }
}

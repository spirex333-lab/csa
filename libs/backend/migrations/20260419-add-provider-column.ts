import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderColumn20260419 implements MigrationInterface {
  name = 'AddProviderColumn20260419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`change_now_orders\`
        ADD COLUMN \`provider\` varchar(32) NOT NULL DEFAULT 'changenow',
        ADD COLUMN \`orderToken\` varchar(128) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`change_now_orders\`
        DROP COLUMN \`provider\`,
        DROP COLUMN \`orderToken\`
    `);
  }
}

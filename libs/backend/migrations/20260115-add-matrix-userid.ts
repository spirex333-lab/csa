import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMatrixUserId1673779200000 implements MigrationInterface {
  name = 'AddMatrixUserId1673779200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add nullable matrixUserId to user
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "matrixUserId" character varying(512)`
    );

    // Add nullable matrixUserId to aibot
    await queryRunner.query(
      `ALTER TABLE "aibot" ADD COLUMN "matrixUserId" character varying(512)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "aibot" DROP COLUMN IF EXISTS "matrixUserId"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN IF EXISTS "matrixUserId"`
    );
  }
}

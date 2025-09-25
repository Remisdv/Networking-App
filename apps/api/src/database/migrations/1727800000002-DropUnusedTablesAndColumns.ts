import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DropUnusedTablesAndColumns1727800000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasTable = async (name: string) => !!(await queryRunner.getTable(name));
    const dropIfExists = async (name: string) => {
      if (await hasTable(name)) await queryRunner.dropTable(name);
    };

    // Tables no longer used
    await dropIfExists('invites');
    await dropIfExists('offers');
    await dropIfExists('students');
    await dropIfExists('schools');

    // Column users.school_id if exists
    const users = await queryRunner.getTable('users');
    if (users?.findColumnByName('school_id')) {
      await queryRunner.dropColumn('users', 'school_id');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Minimal down: recreate tables skeletal if needed (no FKs)
    const createIfMissing = async (table: Table) => {
      const exists = await queryRunner.getTable(table.name);
      if (!exists) await queryRunner.createTable(table, true);
    };

    await createIfMissing(
      new Table({ name: 'schools', columns: [{ name: 'id', type: 'uuid', isPrimary: true }] }),
    );
    await createIfMissing(
      new Table({ name: 'students', columns: [{ name: 'id', type: 'uuid', isPrimary: true }] }),
    );
    await createIfMissing(
      new Table({ name: 'offers', columns: [{ name: 'id', type: 'uuid', isPrimary: true }] }),
    );
    await createIfMissing(
      new Table({ name: 'invites', columns: [{ name: 'id', type: 'uuid', isPrimary: true }] }),
    );

    const users = await queryRunner.getTable('users');
    if (users && !users.findColumnByName('school_id')) {
      await queryRunner.query('ALTER TABLE users ADD COLUMN school_id uuid NULL');
    }
  }
}


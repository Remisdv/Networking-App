import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveDuplicateSchoolId1727800000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) return;

    const dupColumn = table.columns.find((c) => c.name === 'schoolId');
    if (dupColumn) {
      // Drop FKs referencing the duplicate column if any
      const fks = table.foreignKeys.filter((fk) => fk.columnNames.includes('schoolId'));
      for (const fk of fks) {
        await queryRunner.dropForeignKey('users', fk);
      }
      await queryRunner.dropColumn('users', 'schoolId');
    }

    // Ensure the intended column exists with correct type
    const hasSnake = table.columns.some((c) => c.name === 'school_id');
    if (!hasSnake) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({ name: 'school_id', type: 'uuid', isNullable: true }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    if (!table) return;

    const hasDup = table.columns.some((c) => c.name === 'schoolId');
    if (!hasDup) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({ name: 'schoolId', type: 'uuid', isNullable: true }),
      );
    }
  }
}


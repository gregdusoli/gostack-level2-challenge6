import { MigrationInterface, QueryRunner, Table } from 'typeorm';

// enum TransactionType {
//   income = 'income',
//   outcome = 'outcome',
// }

export default class CreateTransactionsTable1604351213893
  implements MigrationInterface {
  private table = 'transactions';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: this.table,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          // {
          //   name: 'type',
          //   type: 'varchar',
          //   enum: [TransactionType.income, TransactionType.outcome],
          //   isNullable: false,
          // },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}

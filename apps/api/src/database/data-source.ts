import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { CreateUsersTable1727200000000 } from './migrations/1727200000000-CreateUsersTable';
import { RemoveDuplicateSchoolId1727800000001 } from './migrations/1727800000001-RemoveDuplicateSchoolId';
import { DropUnusedTablesAndColumns1727800000002 } from './migrations/1727800000002-DropUnusedTablesAndColumns';

config({ path: resolve(__dirname, '../../.env') });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'root',
  password: process.env.DATABASE_PASSWORD ?? 'zDb1kpvxpj0xTAfDflTk8k4B',
  database: process.env.DATABASE_NAME ?? 'networking-database',
  entities: [Company, User],
  migrations: [CreateUsersTable1727200000000, RemoveDuplicateSchoolId1727800000001, DropUnusedTablesAndColumns1727800000002],
  synchronize: true,
  logging: false,
});

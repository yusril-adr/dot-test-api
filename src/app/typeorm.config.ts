import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

import { join } from 'path';
// import { User } from '@modules/users/entities/user.entity';

// Load .env file
config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT'),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DATABASE'),
  entities: [join(__dirname, '../', 'entities', '*.ts')],
  migrations: [join(__dirname, '../../', 'migrations', '*.ts')],
  seeds: [join(__dirname, '../../', 'seeders', '*.seeder.ts')],
  factories: [join(__dirname, '../../', 'factories', '*.seeder.ts')],
  synchronize: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  migrationsTableName: 'typeorm_migration',
};

export default new DataSource(options);

import 'dotenv/config';

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MERCURY_DB_HOST,
  port: +process.env.MERCURY_DB_PORT,
  username: process.env.MERCURY_DB_USERNAME,
  password: process.env.MERCURY_DB_PASSWORD,
  database: process.env.MERCURY_DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*.ts'],
  logging: true,
  synchronize: false,
};

console.log({ dataSourceOptions });

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

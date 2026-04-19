import 'dotenv/config';
import { DataSource } from 'typeorm';

const type = (process.env.DB_TYPE as any) || (process.env.DATABASE_TYPE as any) || 'postgres';
const host = process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || (type === 'mysql' ? '3306' : '5432'));
const username = process.env.DB_USER || process.env.DATABASE_USER || 'postgres';
const password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '';
const database = process.env.DB_NAME || process.env.DATABASE_NAME || 'chatbotbase';

const AppDataSource = new DataSource({
  type: type as any,
  host,
  port,
  username,
  password,
  database,
  synchronize: false,
  logging: false,
  entities: ['libs/backend/**/src/**/*.entity.ts', 'libs/backend/**/src/**/*.entity.js'],
  migrations: ['libs/backend/migrations/*.ts','libs/backend/migrations/*.js'],
});

export { AppDataSource };

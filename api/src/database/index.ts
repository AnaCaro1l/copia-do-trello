import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 3306,
  logging: false,
});

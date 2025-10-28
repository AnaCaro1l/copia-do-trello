import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Workspace } from '../models/Workspace';
import { WorkspaceUser } from '../models/WorkspaceUser';
import { List } from '../models/List';
import { Card } from '../models/Card';
import { Invite } from '../models/Invite';
import { Dialect } from 'sequelize';

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT as Dialect,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT) || 3306,
  models: [User, Workspace, WorkspaceUser, List, Card, Invite],
  logging: false,
});

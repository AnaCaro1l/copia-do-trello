"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("../models/User");
const Workspace_1 = require("../models/Workspace");
const WorkspaceUser_1 = require("../models/WorkspaceUser");
const List_1 = require("../models/List");
const Card_1 = require("../models/Card");
const Invite_1 = require("../models/Invite");
dotenv_1.default.config();
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT) || 3306,
    models: [User_1.User, Workspace_1.Workspace, WorkspaceUser_1.WorkspaceUser, List_1.List, Card_1.Card, Invite_1.Invite],
    logging: false,
});

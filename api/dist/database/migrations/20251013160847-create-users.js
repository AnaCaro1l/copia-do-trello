'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
module.exports = {
    async up(queryInterface) {
        queryInterface.createTable('Users', {
            id: {
                type: sequelize_typescript_1.DataType.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            },
            email: {
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            },
            passwordHash: {
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false,
            },
            createdAt: {
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface) {
        queryInterface.dropTable('Users');
    },
};

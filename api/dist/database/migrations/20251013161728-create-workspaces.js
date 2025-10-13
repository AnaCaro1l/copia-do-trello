'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('Workspaces', {
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
            background: {
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true,
            },
            visibility: {
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            ownerId: {
                type: sequelize_typescript_1.DataType.INTEGER,
                references: { model: 'Users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('Workspaces');
    },
};

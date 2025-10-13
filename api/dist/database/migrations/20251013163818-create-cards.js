'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('Cards', {
            id: {
                type: sequelize_typescript_1.DataType.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true
            },
            media: {
                type: sequelize_typescript_1.DataType.STRING,
                allowNull: true
            },
            listId: {
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                references: {
                    model: 'Lists',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false
            },
            updatedAt: {
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false
            }
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Cards');
    }
};

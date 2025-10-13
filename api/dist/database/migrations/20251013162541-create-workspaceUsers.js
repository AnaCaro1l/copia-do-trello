'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable('WorkspaceUsers', {
            workspaceId: {
                type: sequelize_typescript_1.DataType.INTEGER,
                references: { model: 'Workspaces', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                allowNull: false,
            },
            userId: {
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
        await queryInterface.dropTable('WorkspaceUsers');
    },
};

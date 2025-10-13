'use strict';

import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Workspaces', {
      id: {
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: DataType.STRING,
        allowNull: false,
      },

      background: {
        type: DataType.STRING,
        allowNull: true,
      },

      visibility: {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      ownerId: {
        type: DataType.INTEGER,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },

      createdAt: {
        type: DataType.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: DataType.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Workspaces');
  },
};

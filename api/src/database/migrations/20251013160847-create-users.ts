'use strict';

import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.createTable('Users', {
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

      email: {
        type: DataType.STRING,
        allowNull: false,
      },

      passwordHash: {
        type: DataType.STRING,
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
    queryInterface.dropTable('Users');
  },
};

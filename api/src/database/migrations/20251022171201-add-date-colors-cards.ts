'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.addColumn('Cards', 'dueDate', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Cards', 'color', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Cards', 'dueDate');
    await queryInterface.removeColumn('Cards', 'color');
  }
};

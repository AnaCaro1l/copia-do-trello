'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.addColumn('Lists', 'orderIndex', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Lists', 'orderIndex');
  }
};

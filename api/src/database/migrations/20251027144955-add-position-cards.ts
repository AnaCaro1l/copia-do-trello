'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.addColumn('Cards', 'position', {
      type: 'INTEGER',
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down (queryInterface: QueryInterface){
    await queryInterface.removeColumn('Cards', 'position');
  }
};

'use strict';

import { DataTypes, QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.renameColumn('Workspaces', 'background', 'backgroundUrl');
    await queryInterface.addColumn('Workspaces', 'backgroundColor', {
      type: DataTypes.STRING(10),
      allowNull: true,
    });

  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.renameColumn('Workspaces', 'backgroundUrl', 'background');
    await queryInterface.removeColumn('Workspaces', 'backgroundColor');
  }
};

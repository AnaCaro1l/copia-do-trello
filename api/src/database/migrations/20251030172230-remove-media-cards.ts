'use strict';

import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Cards', 'media');
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Cards', 'media', {
      type: 'VARCHAR(255)',
      allowNull: true,
    });
  },
};

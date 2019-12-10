'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      guid: {
        unique: true,
        allowNull: false,
        type: Sequelize.UUID
    },
      name: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      }
    });
  },
  down: queryInterface => queryInterface.dropTable("skills")
};
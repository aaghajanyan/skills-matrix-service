const roles = require("../config/config").roles;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("roles", {
            id: {
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
                type: Sequelize.ENUM(roles)
            }
        });
    },
    down: queryInterface => queryInterface.dropTable("roles")
};

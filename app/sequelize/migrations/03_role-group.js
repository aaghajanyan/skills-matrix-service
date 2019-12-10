const rolesGroups = require("../config/config").rolesGroups;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("roles_groups", {
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
                type: Sequelize.ENUM(rolesGroups)
            }
        });
    },
    down: queryInterface => queryInterface.dropTable("roles_groups")
};
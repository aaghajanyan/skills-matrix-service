const roles = require("../config/config").roles;
const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Roles, {
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
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Roles)
};

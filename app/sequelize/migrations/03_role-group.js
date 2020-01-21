const rolesGroups = require('../config/config').rolesGroups;
const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.RolesGroup, {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            guid: {
                unique: true,
                allowNull: false,
                type: Sequelize.UUID,
            },
            name: {
                unique: true,
                allowNull: false,
                type: Sequelize.ENUM(rolesGroups),
            },
        });
    },
    down: queryInterface =>
        queryInterface.dropTable(Constants.TableNames.RolesGroup),
};

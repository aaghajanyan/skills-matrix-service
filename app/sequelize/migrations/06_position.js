const roles = require('../config/config').roles;
const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Positions, {
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
                type: Sequelize.STRING,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Positions),
};

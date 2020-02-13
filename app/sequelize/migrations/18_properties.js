const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.criteria_categories, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING,
            },
            items: {
                allowNull: false,
                type:  Sequelize.JSON,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.criteria_categories),
};
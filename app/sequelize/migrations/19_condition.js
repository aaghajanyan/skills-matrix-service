const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Condition, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Condition),
};
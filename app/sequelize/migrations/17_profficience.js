const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Profficience, {
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
            value: {
                unique: true,
                allowNull: false,
                type: Sequelize.INTEGER,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Profficience),
};
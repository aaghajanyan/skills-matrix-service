const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Skills, {
            id: {
                allowNull: false,
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
            icon: {
                unique: false,
                allowNull: false,
                type: Sequelize.STRING,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Skills),
};

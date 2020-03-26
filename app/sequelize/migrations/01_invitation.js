const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Invitations, {
            id: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.STRING,
            },
            email: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING,
            },
            roleGuid: {
                type: Sequelize.UUID,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.invitations),
};

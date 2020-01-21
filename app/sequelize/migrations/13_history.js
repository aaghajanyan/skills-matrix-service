const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.History, {
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
            user_skill_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.UsersSkills,
                    key: Constants.Keys.id,
                    as: Constants.Migrations.History.user_skill_id,
                },
            },
            mark: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            created_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: queryInterface =>
        queryInterface.dropTable(Constants.TableNames.History),
};

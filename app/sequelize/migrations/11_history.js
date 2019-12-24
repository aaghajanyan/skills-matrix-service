const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.History, {
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
            userSkillId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.UsersSkills,
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.History.userSkillId
                }
            },
            mark: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            createdDate: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.History)
};

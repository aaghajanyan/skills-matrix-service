const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.UsersSkills, {
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
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Users,
                    key: Constants.Keys.id,
                    as: Constants.Keys.userId
                }
            },
            skillId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Skills,
                    key: Constants.Keys.id,
                    as: Constants.Keys.skillId
                }
            },
            experience: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            profficience: {
                allowNull: false,
                type: Sequelize.INTEGER
            }
        }).then(() => queryInterface.addConstraint(
            Constants.TableNames.UsersSkills,
            [Constants.Keys.userId, Constants.Keys.skillId],
            {
                type: Constants.Keys.unique,
                name: Constants.Migrations.UserSkill.uniqueUserSkill
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.UsersSkills)
};

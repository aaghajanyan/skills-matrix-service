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
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.userId
                }
            },
            skillId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Skills,
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.skillId
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
            [Constants.Migrations.userId, Constants.Migrations.skillId],
            {
                type: Constants.Migrations.unique,
                name: Constants.Migrations.UserSkill.uniqueUserSkill
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.UsersSkills)
};

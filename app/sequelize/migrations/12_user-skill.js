const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable(Constants.TableNames.UsersSkills, {
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
                user_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.Users,
                        key: Constants.Keys.id,
                        as: Constants.Keys.user_id,
                    },
                },
                skill_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.Skills,
                        key: Constants.Keys.id,
                        as: Constants.Keys.skill_id,
                    },
                },
                experience: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                profficience: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                last_worked_date: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            })
            .then(() =>
                queryInterface.addConstraint(
                    Constants.TableNames.UsersSkills,
                    [Constants.Keys.user_id, Constants.Keys.skill_id],
                    {
                        type: Constants.Keys.unique,
                        name: Constants.Migrations.UserSkill.uniqueUserSkill,
                    }
                )
            );
    },
    down: queryInterface =>
        queryInterface.dropTable(Constants.TableNames.UsersSkills),
};

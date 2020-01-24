const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.SkillHistory, {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            guid: {
                unique: false,
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
            created_date: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.SkillHistory),
};

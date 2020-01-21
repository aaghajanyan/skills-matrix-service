const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable(Constants.TableNames.SkillsRelations, {
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
                category_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.Categories,
                        key: Constants.Keys.id,
                        as: Constants.Keys.category_id,
                    },
                },
            })
            .then(() =>
                queryInterface.addConstraint(
                    Constants.TableNames.SkillsRelations,
                    [Constants.Keys.skill_id, Constants.Keys.category_id],
                    {
                        type: Constants.Keys.unique,
                        name: Constants.Migrations.SkillRelation.uniqueSkillRel,
                    }
                )
            );
    },
    down: queryInterface =>
        queryInterface.dropTable(Constants.TableNames.SkillsRelations),
};

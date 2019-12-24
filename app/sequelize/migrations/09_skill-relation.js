const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.SkillsRelations, {
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
            categoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Categories,
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.categoryId
                }
            }
        }).then(() => queryInterface.addConstraint(
            Constants.TableNames.SkillsRelations,
            [Constants.Migrations.skillId, Constants.Migrations.categoryId],
            {
                type: Constants.Migrations.unique,
                name: Constants.Migrations.SkillRelation.uniqueSkillRel
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.SkillsRelations),
};
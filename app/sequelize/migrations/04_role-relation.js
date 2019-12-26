const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.RolesRelation, {
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
            roleGroupId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.RolesGroup,
                    key: Constants.Keys.id,
                    as: Constants.Keys.roleGroupId
                }
            },
            roleId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Roles,
                    key: Constants.Keys.id,
                    as: Constants.Migrations.RoleRelation.roleId
                }
            }
        }).then(() => queryInterface.addConstraint(
            Constants.TableNames.RolesRelation,
            [Constants.Migrations.RoleRelation.roleId, Constants.Keys.roleGroupId],
            {
                type: Constants.Keys.unique,
                name: Constants.Migrations.RoleRelation.uniqueRoleRel
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.RolesRelation)
};
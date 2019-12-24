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
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.roleGroupId
                }
            },
            roleId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Roles,
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.RoleRelation.roleId
                }
            }
        }).then(() => queryInterface.addConstraint(
            Constants.TableNames.RolesRelation,
            [Constants.Migrations.RoleRelation.roleId, Constants.Migrations.roleGroupId],
            {
                type: Constants.Migrations.unique,
                name: Constants.Migrations.RoleRelation.uniqueRoleRel
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.RolesRelation)
};
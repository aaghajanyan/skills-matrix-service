const {Constants} = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable(Constants.TableNames.RolesRelation, {
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
                role_group_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.RolesGroup,
                        key: Constants.Keys.id,
                        as: Constants.Keys.role_group_id
                    }
                },
                role_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.Roles,
                        key: Constants.Keys.id,
                        as: Constants.Migrations.RoleRelation.role_id
                    }
                }
            })
            .then(() =>
                queryInterface.addConstraint(
                    Constants.TableNames.RolesRelation,
                    [Constants.Migrations.RoleRelation.role_id, Constants.Keys.role_group_id],
                    {
                        type: Constants.Keys.unique,
                        name: Constants.Migrations.RoleRelation.uniqueRoleRel
                    }
                )
            );
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.RolesRelation)
};

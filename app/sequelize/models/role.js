const roles = require("../config/config").roles;
const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        Constants.ModelNames.Roles,
        {
            name: {
                type: DataTypes.ENUM,
                values: roles,
                defaultValue: "employee",
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NameMissing
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.RoleAlreadyExists
                }
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            timestamps: false
        }
    );

    Role.associate = models => {
        Role.belongsToMany(models.roles_groups, {
            through: Constants.TableNames.RolesRelation,
            as: Constants.Associate.Aliases.roleGroup,
            foreignKey: Constants.Migrations.roleId,
            timestamps: false
        });
    };
    return Role;
};

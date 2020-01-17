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
                    msg: Constants.ModelErrors.NAME_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.ROLE_ALREADY_EXISTS
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
            foreignKey: Constants.Keys.role_id,
            timestamps: false
        });
    };
    return Role;
};

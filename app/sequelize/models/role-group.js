const rolesGroups = require("../config/config").rolesGroups;
const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const RoleGroup = sequelize.define(
        Constants.ModelNames.RolesGroup,
        {
            name: {
                type: DataTypes.ENUM,
                values: rolesGroups,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.ROLE_GROUP_ALREADY_EXISTS
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

    RoleGroup.associate = models => {
        RoleGroup.belongsToMany(models.roles, {
            through: Constants.TableNames.RolesRelation,
            as: Constants.Associate.Aliases.roles,
            foreignKey: Constants.Keys.role_group_id,
            timestamps: false
        });
    };
    return RoleGroup;
};

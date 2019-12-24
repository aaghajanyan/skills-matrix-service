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
                    msg: Constants.ModelErrors.NameMissing
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.RoleGroupAlreadyExists
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
            foreignKey: Constants.Migrations.roleGroupId,
            timestamps: false
        });
    };
    return RoleGroup;
};

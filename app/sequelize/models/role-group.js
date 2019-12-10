const rolesGroups = require("../config/config").rolesGroups;

module.exports = (sequelize, DataTypes) => {
    const RoleGroup = sequelize.define(
        "roles_groups",
        {
            name: {
                type: DataTypes.ENUM,
                values: rolesGroups,
                allowNull: {
                    args: false,
                    msg: "Please enter name"
                },
                unique: {
                    args: true,
                    msg: "Role group already exists"
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
            through: "roles_relations",
            as: "roles",
            foreignKey: "roleGroupId",
            timestamps: false
        });
    };
    return RoleGroup;
};
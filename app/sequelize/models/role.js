const roles = require("../config/config").roles;

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "roles",
        {
            name: {
                type: DataTypes.ENUM,
                values: roles,
                defaultValue: "employee",
                allowNull: {
                    args: false,
                    msg: "Please enter name"
                },
                unique: {
                    args: true,
                    msg: "Role already exists"
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
            through: "roles_relations",
            as: "roleGroup",
            foreignKey: "roleId",
            timestamps: false
        });
    };
    return Role;
};
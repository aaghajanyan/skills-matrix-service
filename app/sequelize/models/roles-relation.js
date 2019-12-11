const DefaultRoles = require("../utils/DefaultRoles");

module.exports = (sequelize, DataTypes) => {
    const RoleRelation = sequelize.define(
        "roles_relations",
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            roleGroupId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: "Please enter role group id"
                }
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: "Please enter role id"
                }
            }
        },
        {
            timestamps: false
        }
    );

    RoleRelation.associate = models => {};
    return RoleRelation;
};

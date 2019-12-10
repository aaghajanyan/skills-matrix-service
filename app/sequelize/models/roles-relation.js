const Roles = require("../utils/Roles");

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

    const rolesAndGroupRelation = {
        super_user: [
            "create_user",
            "create_skill",
            "update_skill",
            "manage_team",
            "employee"
        ],
        team_lead: [
            "manage_team",
            "employee"
        ],
        employee: ["employee"]
    };

    RoleRelation.initDefaultValues = async function(models) {
        await Roles.initializeRoleTable(models);
        await Roles.initializeRolesGroupsTable(models);
        await Roles.initializeRolesRelationTable(models, rolesAndGroupRelation);
    };
    
    RoleRelation.associate = models => {};
    return RoleRelation;
};
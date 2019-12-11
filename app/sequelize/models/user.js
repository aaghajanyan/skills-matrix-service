const DefaultUsers = require("../utils/DefaultUsers");
const DefaultRoles = require("../utils/DefaultRoles");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "user",
        {
            email: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: "Please enter email address"
                },
                unique: {
                    args: true,
                    msg: "Email already exists"
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: "Please enter a valid email address"
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: "Please enter a password"
                },
            },
            fname: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: "Please enter a firstname."
                },
            },
            lname: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: "Please enter a lastname."
                },
            },
            branchName: {
                type: DataTypes.ENUM,
				values: [
                    "Vanadzor",
                    "Erevan",
                    "Goris"
                ],
                allowNull: {
                    args: false,
                    msg: "Please choose your branch"
                }
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            createdDate: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            startedToWorkDate: {
                type: DataTypes.DATE,
                allowNull: {
                    args: false,
                    msg: "Please enter started to work date."
                },
            },
            roleGroupId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 3
            },
            position: {
                type: DataTypes.ENUM,
				values: [
                    "Beginner SW Engineer",
                    "SW Engineer",
                    "Senior SW Engineer",
                    "Beginner QA Tester",
                    "QA Tester",
                    "SQE Analyst",
                    "Sr. Software Quality Engineer",
                    "QA Analyst",
                    "QA lead",
                    "Team lead",
                    "Graphic designer",
                    "technical manager",
                    "Senior Team lead",
                    "Project Manager",
                    "3D modeler",
                    "UIUX designer",
                    "SW Architect"
                ],
                allowNull: {
                    args: false,
                    msg: "Please choose your position"
                }
            }
        },
        {
            timestamps: false
        }
    );
    User.associate = models => {
        User.belongsTo(models.roles_groups, {
            as: "roleGroup",
            foreignKey: "roleGroupId",
            targetkey: 'id'
        });
    };

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

    User.initDefaultValues = async function(models) {
        await DefaultRoles.initializeRoleTable(models);
        await DefaultRoles.initializeRolesGroupsTable(models);
        await DefaultRoles.initializeRolesRelationTable(models, rolesAndGroupRelation);
        await DefaultUsers.initializeUserTable(models);
    };

    return User;
};
const DefaultUsers = require("../utils/DefaultUsers");
const DefaultRoles = require("../utils/DefaultRoles");
const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        Constants.ModelNames.User,
        {
            email: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.EMAIL_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.EMAIL_ALREADY_EXISTS
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: Constants.ModelErrors.EMAIL_IS_INVALID
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.PASSWORD_IS_MISSING
                },
            },
            fname: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.FIRSTNAME_IS_MISSING
                },
            },
            lname: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.LASTNAME_IS_MISSING
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
                    msg: Constants.ModelErrors.BRANCH_IS_MISSING
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
                    msg: Constants.ModelErrors.STARTED_TO_WORK_DATE_IS_MISSING
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
                    msg: Constants.ModelErrors.POSITION_IS_MISSING
                }
            }
        },
        {
            timestamps: false
        }
    );
    User.associate = models => {
        User.belongsTo(models.roles_groups, {
            as: Constants.Associate.Aliases.roleGroup,
            foreignKey: Constants.Migrations.roleGroupId,
            targetkey: Constants.Migrations.id,
        }),
        User.belongsToMany(models.skill, {
            through: Constants.TableNames.UsersSkills,
            foreignKey: Constants.Migrations.userId,
            as: Constants.Associate.Aliases.skills,
        }),
        User.belongsToMany(models.category, {
            through: Constants.TableNames.UsersCategories,
            foreignKey: Constants.Migrations.userId,
            as: Constants.Associate.Aliases.categories,
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

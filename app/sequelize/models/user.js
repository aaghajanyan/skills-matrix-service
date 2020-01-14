const DefaultUsers = require("../utils/DefaultUsers");
const DefaultRoles = require("../utils/DefaultRoles");
const DefaultBranches = require("../utils/DefaultBranches");
const DefaultPosition = require("../utils/DefaultPosition");
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
            branchId: {
                allowNull: false,
                type: DataTypes.INTEGER,
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
            positionId: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false
        }
    );
    User.associate = models => {
        User.belongsTo(models.roles_groups, {
            as: Constants.Associate.Aliases.roleGroup,
            foreignKey: Constants.Keys.roleGroupId,
            targetkey: Constants.Keys.id,
        }),
        User.belongsTo(models.branch, {
            as: Constants.Associate.Aliases.branch,
            foreignKey: Constants.Keys.branchId,
            targetkey: Constants.Keys.id,
        }),
        User.belongsTo(models.position, {
            as: Constants.Associate.Aliases.position,
            foreignKey: Constants.Keys.positionId,
            targetkey: Constants.Keys.id,
        }),
        User.belongsToMany(models.skill, {
            through: Constants.TableNames.UsersSkills,
            foreignKey: Constants.Keys.user_id,
            as: Constants.Associate.Aliases.skills,
        }),
        User.belongsToMany(models.category, {
            through: Constants.TableNames.UsersCategories,
            foreignKey: Constants.Keys.user_id,
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
        await DefaultBranches.initializeBranchTable(models);
        await DefaultPosition.initializePositionTable(models);
        await DefaultRoles.initializeRolesGroupsTable(models);
        await DefaultRoles.initializeRolesRelationTable(models, rolesAndGroupRelation);
        await DefaultUsers.initializeUserTable(models);
        await sequelize.query(`CREATE OR REPLACE VIEW ${Constants.ViewQueries.view_name} AS ${Constants.ViewQueries.users_view}`);
        await sequelize.query(`CREATE OR REPLACE VIEW ${Constants.ViewQueries.unique_view_name} AS ${Constants.ViewQueries.users_view_unique}`);
    };

    return User;
};

// const DefaultRoles = require('../utils/DefaultRoles');
// const DefaultPosition = require('../utils/DefaultPosition');
const { Constants } = require('../../constants/Constants');
const config = require('../config/config');
const { initializeUserTable } = require('../utils/defaultUsers');
const {initializeBranchTable} = require('../utils/defaultBranches');
const {initializePositionTable} = require('../utils/defaultPosition');
const {initializeRoleTable, initializeRolesRelationTable, initializeRolesGroupsTable} = require('../utils/defaultRoles');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        Constants.ModelNames.User,
        {
            email: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.EMAIL_IS_MISSING,
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.EMAIL_ALREADY_EXISTS,
                },
                validate: {
                    isEmail: {
                        args: true,
                        msg: Constants.ModelErrors.EMAIL_IS_INVALID,
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.PASSWORD_IS_MISSING,
                },
            },
            fname: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.FIRSTNAME_IS_MISSING,
                },
            },
            lname: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.LASTNAME_IS_MISSING,
                },
            },
            branch_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            created_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            started_to_work_date: {
                type: DataTypes.DATE,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.STARTED_TO_WORK_DATE_IS_MISSING,
                },
            },
            role_group_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 3,
            },
            position_id: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false,
        }
    );
    User.associate = models => {
        User.belongsTo(models.roles_groups, {
            as: Constants.Associate.Aliases.roleGroup,
            foreignKey: Constants.Keys.role_group_id,
            targetkey: Constants.Keys.id,
        }),
            User.belongsTo(models.branch, {
                as: Constants.Associate.Aliases.branch,
                foreignKey: Constants.Keys.branch_id,
                targetkey: Constants.Keys.id,
            }),
            User.belongsTo(models.position, {
                as: Constants.Associate.Aliases.position,
                foreignKey: Constants.Keys.position_id,
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
            'create_user',
            'create_skill',
            'update_skill',
            'manage_team',
            'employee',
        ],
        team_lead: ['manage_team', 'employee'],
        employee: ['employee'],
    };

    User.initDefaultValues = async function(models) {
        await initializeRoleTable(models);
        await initializeBranchTable(models);
        await initializePositionTable(models);
        await initializeRolesGroupsTable(models);
        await initializeRolesRelationTable(
            models,
            rolesAndGroupRelation
        );
        await initializeUserTable(models);
        await sequelize.query(
            `${Constants.ViewQueries.create_or_replace_view} ${config.queryTemplate.view_name} AS ${config.queryTemplate.users_view}`
        );
        await sequelize.query(
            `${Constants.ViewQueries.create_or_replace_view} ${config.queryTemplate.unique_view_name} AS ${config.queryTemplate.users_view_unique}`
        );
    };

    return User;
};

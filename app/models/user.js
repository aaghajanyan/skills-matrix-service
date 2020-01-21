const {
    user: userModel,
    roles: rolesModel,
    branch: branchesModel,
    position: positionModel,
    roles_relations: rolesRelationModel,
    roles_groups: rolesGroupsModel,
    users_skills: userSkillsModel,
    users_categories: userCategoriesModel,
    skill: skillModel,
    category: categoryModel,
    skills_relation: skillsRelationModel,
} = require('../sequelize/models');
const bcrypt = require('bcrypt');
const { Constants } = require('../constants/Constants');
const Position = require('./position');
const Branch = require('./branch');

class User {
    static async findOneUser(condition) {
        return await userModel.findOne({ where: { ...condition } });
    }

    static async getByGuid(guid) {
        const user = await userModel.findOne({
            where: { guid: guid },
            attributes: {
                exclude: [
                    Constants.Keys.password,
                    Constants.Keys.role_group_id,
                ],
            },
            include: [
                {
                    model: rolesGroupsModel,
                    as: Constants.Associate.Aliases.roleGroup,
                    required: false,
                    include: {
                        model: rolesModel,
                        as: Constants.Associate.Aliases.roles,
                        attributes: [Constants.Keys.name],
                        required: false,
                        through: {
                            model: rolesRelationModel,
                            as: Constants.Associate.Aliases.roleRelation,
                            attributes: [],
                        },
                    },
                },
                {
                    model: branchesModel,
                    as: Constants.Associate.Aliases.branch,
                    required: false,
                },
                {
                    model: positionModel,
                    as: Constants.Associate.Aliases.position,
                    required: false,
                },
                {
                    attributes: { exclude: [Constants.Keys.id] },
                    model: skillModel,
                    as: Constants.Associate.Aliases.skills,
                    required: false,
                    through: {
                        model: userSkillsModel,
                        as: Constants.Associate.Aliases.skillMark,
                        attributes: [
                            Constants.Controllers.Search.EXPERIENCE,
                            Constants.Controllers.Search.PROFFICIENCE,
                            Constants.Keys.guid,
                        ],
                    },
                    include: {
                        model: categoryModel,
                        as: Constants.Associate.Aliases.categories,
                        attributes: [Constants.Keys.name, Constants.Keys.guid],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: Constants.Associate.Aliases.skillsRelationModel,
                            attributes: [],
                        },
                    },
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: [
                            Constants.Controllers.Search.EXPERIENCE,
                            Constants.Controllers.Search.PROFFICIENCE,
                            Constants.Keys.guid,
                        ],
                    },
                },
            ],
        });
        return user;
    }

    static async getUsers(whereCondition = {}) {
        const filtredWhereCondition = whereCondition ? whereCondition : {};
        const users = await userModel.findAll({
            attributes: {
                exclude: [
                    Constants.Keys.password,
                    Constants.Keys.role_group_id,
                ],
            },
            where: filtredWhereCondition,
            include: [
                {
                    attributes: { exclude: [Constants.Keys.id] },
                    model: rolesGroupsModel,
                    as: Constants.Associate.Aliases.roleGroup,
                    required: false,
                    include: {
                        model: rolesModel,
                        as: Constants.Associate.Aliases.roles,
                        attributes: [Constants.Keys.name],
                        required: false,
                        through: {
                            model: rolesRelationModel,
                            as: Constants.Associate.Aliases.roleRelation,
                            attributes: [],
                        },
                    },
                },
                {
                    model: branchesModel,
                    as: Constants.Associate.Aliases.branch,
                    required: false,
                },
                {
                    model: positionModel,
                    as: Constants.Associate.Aliases.position,
                    required: false,
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: skillModel,
                    as: Constants.Associate.Aliases.skills,
                    required: false,
                    through: {
                        model: userSkillsModel,
                        as: Constants.Associate.Aliases.skillMark,
                        attributes: [
                            Constants.Controllers.Search.EXPERIENCE,
                            Constants.Controllers.Search.PROFFICIENCE,
                            Constants.Keys.guid,
                        ],
                    },
                    include: {
                        model: categoryModel,
                        as: Constants.Associate.Aliases.categories,
                        attributes: [Constants.Keys.name, Constants.Keys.guid],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: Constants.Associate.Aliases.skillsRelationModel,
                            attributes: [],
                        },
                    },
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: [
                            Constants.Controllers.Search.EXPERIENCE,
                            Constants.Controllers.Search.PROFFICIENCE,
                            Constants.Keys.guid,
                        ],
                    },
                },
            ],
        });
        return users;
    }

    static async create(data) {
        const salt = await bcrypt.genSalt(10);
        data.password = bcrypt.hashSync(data.password, salt);
        const position = await Position.find({ guid: data.positionGuid });
        data.position_id = position.id;
        const branch = await Branch.find({ guid: data.branchGuid });
        data.branch_id = branch.id;
        return userModel.create(data);
    }

    static async update(guid, data) {
        const salt = await bcrypt.genSalt(10);
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return userModel.update(data, { where: { guid: guid } });
    }
}

module.exports = User;

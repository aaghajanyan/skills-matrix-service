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
    skills_relation: skillsRelationModel
} = require("../sequelize/models");
const bcrypt = require("bcrypt");
const {
    getWhereQueryLength,
    initFinallyWhereQuery,
    filterUsers
} = require("../helper/searchHelper");
const { Constants } = require("../constants/Constants");
const Position = require("./position");
const Branch = require("./branch");


class User {

    static async findOneUser(condition) {
        return await userModel.findOne({where : { ...condition } });
    }

    static async getByGuid(guid) {
        const user = await userModel.findOne({
            where: { guid: guid },
            attributes: { exclude: [Constants.Keys.password, Constants.Keys.roleGroupId] },
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
                            attributes: []
                        }
                    }
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
                        attributes: [Constants.Controllers.Search.EXPERIENCE, Constants.Controllers.Search.PROFFICIENCE, Constants.Keys.guid]
                    },
                    include: {
                        model: categoryModel,
                        as: Constants.Associate.Aliases.categories,
                        attributes: [Constants.Keys.name, Constants.Keys.guid],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: Constants.Associate.Aliases.skillsRelationModel,
                            attributes: []
                        }
                    }
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: [Constants.Controllers.Search.EXPERIENCE, Constants.Controllers.Search.PROFFICIENCE, Constants.Keys.guid]
                    },
                }
            ]
        });
        return user;
    }

    static async getUsers() {
        const users = await userModel.findAll({
            attributes: { exclude: [Constants.Keys.id, Constants.Keys.password, Constants.Keys.roleGroupId] },
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
                            attributes: []
                        }
                    }
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
                        attributes: [Constants.Controllers.Search.EXPERIENCE, Constants.Controllers.Search.PROFFICIENCE, Constants.Keys.guid]
                    },
                    include: {
                        model: categoryModel,
                        as: Constants.Associate.Aliases.categories,
                        attributes: [Constants.Keys.name, Constants.Keys.guid],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: Constants.Associate.Aliases.skillsRelationModel,
                            attributes: []
                        }
                    }
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: [Constants.Controllers.Search.EXPERIENCE, Constants.Controllers.Search.PROFFICIENCE, Constants.Keys.guid]
                    },
                }
            ]
        });
        return users;
    }

    static async create(data) {
        const salt = await bcrypt.genSalt(10);
        data.password = bcrypt.hashSync(data.password, salt);
        const position = await Position.find({ guid: data.positionGuid })
        data.positionId = position.id;
        const branch = await Branch.find({ guid: data.branchGuid })
        data.branchId = branch.id;
        return userModel.create(data);
    }

    static async update(guid, data) {
        const salt = await bcrypt.genSalt(10);
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return userModel.update(data, { where: { guid: guid } });
    }

    static async searchUser(queryWhere, skillIdsList, categoriesIdsList) {
        const {
            usersCondition,
            branchCondition,
            positionCondition,
            categoriesCondition,
            skillsCondition,
            usersSkillsCondition,
            usersCategoriesCondition
        } = queryWhere;

        initFinallyWhereQuery(usersCondition, true);
        initFinallyWhereQuery(branchCondition);
        initFinallyWhereQuery(positionCondition);
        initFinallyWhereQuery(skillsCondition);
        initFinallyWhereQuery(categoriesCondition);
        initFinallyWhereQuery(usersSkillsCondition);
        initFinallyWhereQuery(usersCategoriesCondition);

        const userQueryCount = getWhereQueryLength(usersCondition, true);
        const branchQueryCount = getWhereQueryLength(branchCondition);
        const positionQueryCount = getWhereQueryLength(positionCondition);
        const userSkillQueryCount = getWhereQueryLength(usersSkillsCondition);
        const userCategoryQueryCount = getWhereQueryLength(
            usersCategoriesCondition
        );

        const users = await userModel.findAll({
            where: usersCondition,
            required: userQueryCount > 0,
            attributes: { exclude: [Constants.Keys.password, Constants.Keys.roleGroupId] },
            include: [
                {
                    // attributes: { exclude: [Constants.Keys.id] },
                    model: branchesModel,
                    as: Constants.Associate.Aliases.branch,
                    required: branchQueryCount > 0,
                    where: branchCondition,
                },
                {
                    model: positionModel,
                    as: Constants.Associate.Aliases.position,
                    required: positionQueryCount > 0,
                    where: positionCondition,
                },
                {
                    // attributes: { exclude: [Constants.Keys.id] },
                    model: skillModel,
                    as: Constants.Associate.Aliases.skills,
                    required: userSkillQueryCount > 0,
                    through: {
                        model: userSkillsModel,
                        where: usersSkillsCondition,
                        required: userSkillQueryCount > 0,
                        as: Constants.Associate.Aliases.skillMark,
                        attributes: { exclude: [Constants.Keys.id] },
                    }
                },
                {
                    // attributes: { exclude: [Constants.Keys.id] },
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: userCategoryQueryCount > 0,
                    through: {
                        model: userCategoriesModel,
                        where: usersCategoriesCondition,
                        required: userCategoryQueryCount > 0,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: { exclude: [Constants.Keys.id] },
                    }
                }
            ]
        });
        return await filterUsers(users, skillIdsList, categoriesIdsList);
    };
}

module.exports = User;

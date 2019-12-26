const {
    user: userModel,
    roles: rolesModel,
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


class User {

    static async findOneUser(condition) {
        const user =  await userModel.findOne({where : { ...condition } });
        return user;
    }

    static async getByGuid(guid) {
        const user = await userModel.findOne({
            where: { guid: guid },
            attributes: { exclude: ["password", "roleGroupId"] },
            include: [
                {
                    model: rolesGroupsModel,
                    as: "roleGroup",
                    required: false,
                    include: {
                        model: rolesModel,
                        as: "roles",
                        attributes: ["name"],
                        required: false,
                        through: {
                            model: rolesRelationModel,
                            as: "roleRelation",
                            attributes: []
                        }
                    }
                },
                {
                    attributes: { exclude: ["id"] },
                    model: skillModel,
                    as: "skills",
                    required: false,
                    through: {
                        model: userSkillsModel,
                        as: "skillMark",
                        attributes: ["experience", "profficience", "guid"]
                    },
                    include: {
                        model: categoryModel,
                        as: "categories",
                        attributes: ["name", "guid"],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: "skillsRelationModel",
                            attributes: []
                        }
                    }
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: categoryModel,
                    as: "categories",
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: "categoryMark",
                        attributes: ["experience", "profficience", "guid"]
                    },
                }
            ]
        });
        return user;
    }

    static async getUsers() {
        const users = await userModel.findAll({
            attributes: { exclude: ["id", "password", "roleGroupId"] },
            include: [
                {
                    attributes: { exclude: ["id"] },
                    model: rolesGroupsModel,
                    as: "roleGroup",
                    required: false,
                    include: {
                        model: rolesModel,
                        as: "roles",
                        attributes: ["name"],
                        required: false,
                        through: {
                            model: rolesRelationModel,
                            as: "roleRelation",
                            attributes: []
                        }
                    }
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: skillModel,
                    as: "skills",
                    required: false,
                    through: {
                        model: userSkillsModel,
                        as: "skillMark",
                        attributes: ["experience", "profficience", "guid"]
                    },
                    include: {
                        model: categoryModel,
                        as: "categories",
                        attributes: ["name", "guid"],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: "skillsRelationModel",
                            attributes: []
                        }
                    }
                },
                {
                    // attributes: { exclude: ["id"] },
                    model: categoryModel,
                    as: "categories",
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: "categoryMark",
                        attributes: ["experience", "profficience", "guid"]
                    },
                }
            ]
        });
        return users;
    }

    static async create(data) {
        const salt = await bcrypt.genSalt(10);
        data.password = bcrypt.hashSync(data.password, salt);
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
            categoriesCondition,
            skillsCondition,
            usersSkillsCondition,
            usersCategoriesCondition
        } = queryWhere;

        initFinallyWhereQuery(usersCondition, true);
        initFinallyWhereQuery(skillsCondition);
        initFinallyWhereQuery(categoriesCondition);
        initFinallyWhereQuery(usersSkillsCondition);
        initFinallyWhereQuery(usersCategoriesCondition);

        const userQueryCount = getWhereQueryLength(usersCondition, true);
        const userSkillQueryCount = getWhereQueryLength(usersSkillsCondition);
        const userCategoryQueryCount = getWhereQueryLength(
            usersCategoriesCondition
        );

        const users = await userModel.findAll({
            where: usersCondition,
            required: userQueryCount > 0,
            attributes: { exclude: [Constants.Migrations.password, Constants.Migrations.roleGroupId] },
            include: [
                {
                    // attributes: { exclude: [Constants.Migrations.id] },
                    model: skillModel,
                    as: Constants.Associate.Aliases.skills,
                    required: userSkillQueryCount > 0,
                    through: {
                        model: userSkillsModel,
                        where: usersSkillsCondition,
                        required: userSkillQueryCount > 0,
                        as: Constants.Associate.Aliases.skillMark,
                        attributes: { exclude: [Constants.Migrations.id] },
                    }
                },
                {
                    // attributes: { exclude: [Constants.Migrations.id] },
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: userCategoryQueryCount > 0,
                    through: {
                        model: userCategoriesModel,
                        where: usersCategoriesCondition,
                        required: userCategoryQueryCount > 0,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: { exclude: [Constants.Migrations.id] },
                    }
                }
            ]
        });
        return await filterUsers(users, skillIdsList, categoriesIdsList);
    };
}

module.exports = User;

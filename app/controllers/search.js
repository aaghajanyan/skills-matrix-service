const {
    user: userModel,
    roles: rolesModel,
    roles_relations: rolesRelationModel,
    roles_groups: rolesGroupsModel,
    users_skills: userSkillsModel,
    users_categories: userCategoriesModel,
    skill: skillModel,
    category: categoryModel,
    skills_relation: skillsRelationModel,
    categories_relation: categoriesRelationModel,
    Sequelize: Sequelize
} = require("../sequelize/models");

const Op = Sequelize.Op;

const findData = async function(request, response, next) {
    try {
        const whereCondition = {
            usersCondition: [],
            categoriesCondition: [],
            skillsCondition: [],
            usersSkillsCondition: [],
            usersCategoriesCondition: [],
        };
        request.body.forEach(async (item) => {
            const { type, condition, items } = item;
            const where = collectCondition(items, condition);
            const model = await getModel(whereCondition, where, type, next);
        })
        const users = await getUsers(whereCondition);
        response.status(200).send({
            success: true,
            message: 'Search',
            users: users
        })
    } catch (error) {
        response.status(409).send({
            success: false,
            message: 'Could not search users.',
        })
    }
};

const collectCondition = (items) => {
    const where = [];
    Object.keys(items).forEach(function (item) {
        const tmpCondition = {};
        tmpCondition[item] = items[item];
        where.push(tmpCondition);
    });
    return where;
}

const separateConditionsByType = async (conditionObj, relatedConditionObj, condition) => {
    condition.forEach(function (item) {
        const keyName = Object.keys(item);
        const tmpCondition = {};
        tmpCondition[keyName] = item[keyName];
        if(keyName != 'name') {
            tmpCondition[keyName] = {[Op.gte]: item[keyName]}; //{experience: {[Op.gt]: 5}}
            relatedConditionObj.push(tmpCondition);
        } else {
            conditionObj.push(tmpCondition);
        }
    });
}

const getModel = async (conditionsObj, condition, type, next) => {
    switch(type) {
        case 'skill':
            separateConditionsByType(conditionsObj.skillsCondition, conditionsObj.usersSkillsCondition, condition);
            return skillModel;
        case 'category':
            separateConditionsByType(conditionsObj.categoriesCondition, conditionsObj.usersCategoriesCondition, condition);
            return categoryModel;
        case 'user':
            conditionsObj.usersCondition.push(condition[0]);
            return userModel;
        default: {
            let err = new Error('Invalid type to search employees');
            err.status = 400;
            next(err);
        }
    }
}

const getUsers = async(conditionsByCriteria) => {
    const {
        usersCondition,
        categoriesCondition,
        skillsCondition,
        usersSkillsCondition,
        usersCategoriesCondition
    } = conditionsByCriteria;

    const users = await userModel.findAll({
        where:   usersCondition,
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
                attributes: { exclude: ["id"] },
                model: skillModel,
                where: {[Op.or]: skillsCondition },
                as: "skills",
                required: skillsCondition.length > 0 ? true : false,
                through: {
                    model: userSkillsModel,
                    where: usersSkillsCondition, //{experience: {[Op.gt]: 5}},//
                    as: "skillMark",
                    attributes: ["currentMark", "experience", "profficience", "guid"]
                }
            },
            {
                attributes: { exclude: ["id"] },
                model: categoryModel,
                where: categoriesCondition,
                as: "categories",
                required: categoriesCondition.length > 0  ? true : false,
                through: {
                    model: userCategoriesModel,
                    where: usersCategoriesCondition,
                    as: "categoryMark",
                    attributes: ["experience", "profficience", "guid"]
                },
            }
        ]
    });
    return users;
}

module.exports = {
    findData
};

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

const findData = async function(request, response) {
    const { type, condition, items } = request.body[0];

    const whereCondition = {
        usersCondition: [],
        usersSkillsCondition: [],
        categoriesCondition: [],
        skillsCondition: []
    };
    const where = collectCondition(items, condition);
    console.log('\n\n where: ', where);
    const opCondition = getCondition(condition);
    console.log('\n\n opCondition: ', opCondition);
    const model = await getModel(whereCondition, where, type);
    const users = await getUsers(whereCondition);

    response.status(200).send({
        success: true,
        message: 'Search',
        users: users
    })
};

const getCondition = (condition) => {
    switch(condition) {
        case 'equal':
            return Op.and;
        case 'not equal':
            return Op.and;
        case 'greater':
            return Op.gte;
        case 'lesser':
            return Op.lt;
    }
}

const collectCondition = (items) => {
    const where = [];
    Object.keys(items).forEach(function (item) {
        const tmpCondition = {};
        tmpCondition[item] = items[item];
        where.push(tmpCondition);
    });
    return where;
}

const getModel = async (conditionsObj, condition, type) => {
    switch(type) {
        case 'skill':
            conditionsObj.skillsCondition = condition;
            return skillModel;
        case 'category':
            conditionsObj.categoriesCondition = condition;
            return categoryModel;
        case 'user':
            console.log("\n\nconditionsObj = ", conditionsObj);
            console.log("\n\ncondition = ", condition);
            conditionsObj.usersCondition = condition;
            return userModel;
        case 'user_skill':
            conditionsObj.usersSkillsCondition = condition;
            return users_skills;
    }
}

const getUsers = async(conditionsByCriteria) => {
    // const {
    //     usersCondition,
    //     usersSkillsCondition,
    //     categoriesCondition,
    //     skillsCondition
    // } = conditionsByCriteria;

    console.log('\n\nC = ', conditionsByCriteria);
    const users = await userModel.findAll({
        where:  conditionsByCriteria.usersCondition,
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
                where: conditionsByCriteria.skillsCondition,
                as: "skills",
                required: true,
                through: {
                    model: userSkillsModel,
                    where: {experience: 5},
                    as: "skillMark",
                    attributes: ["currentMark", "experience", "profficience", "guid"]
                }
            },
            {
                attributes: { exclude: ["id"] },
                model: categoryModel,
                where: conditionsByCriteria.categoriesCondition,
                as: "categories",
                required: true,
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

module.exports = {
    findData
};

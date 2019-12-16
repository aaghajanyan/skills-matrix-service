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
        console.log('\n\n where: ', where);
        const opCondition = getCondition(condition);
        console.log('\n\n opCondition: ', opCondition);
        const model = await getModel(whereCondition, where, type, next);
    })

    console.log('\n\n whereCondition: ', whereCondition);

    const users = await getUsers(whereCondition);

    response.status(200).send({
        success: true,
        message: 'Search',
        users: users
    })
};

// const correctCollectedData = async(whereCondition) => {
//     whereCondition.forEach(async (item) => {

//     })
// }

const getCondition = (condition) => {
    switch(condition) {
        case 'equal':
            return Op.and;
        case 'not equal':
            return Op.ne;
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

// const separateConditionsByType = async (conditionObj, relatedConditionObj, condition) => {
//     condition.forEach(function (item) {
//         const keyName = Object.keys(item);
//         const tmpCondition = {};
//         tmpCondition[keyName] = item[keyName];
//         if(keyName != 'name') {
//             relatedConditionObj.push(tmpCondition);
//         } else {
//             conditionObj.push(tmpCondition);
//         }
//     });
// }

const separateConditionsByType = async (conditionObj, relatedConditionObj, condition) => {
    condition.forEach(function (item) {
        const keyName = Object.keys(item);
        const tmpCondition = {};
        tmpCondition[keyName] = item[keyName];
        if(keyName != 'name') {
            tmpCondition[keyName] = {[Op.gte]: item[keyName]}; //{experience: {[Op.gt]: 5}}
            relatedConditionObj.push(tmpCondition);
        } else {
            console.log("\n\n **** ELSE", conditionObj);
            // tmpCondition[keyName] = item[keyName];
            conditionObj.forEach(async (item)=> {
                // console.log("\n\n UUU 5: ", item);
                // console.log("\n\n UUU 5: ", item[0]);
                // console.log("\n\n UUU 5: ", Object.values(item));
                // console.log("\n\n UUU 5: ", Object.keys(item));

                // if (Object.values(item)[0] == Object.keys(tmpCondition)[0]) {
                //     console.log("\n\n **** equal index");
                // }
            })
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

    // const skillReq = skillsCondition.length > 0 ? true : false;
    // const categoryReq= categoriesCondition.length > 0  ? true : false;
    console.log('\n\nALL = ', conditionsByCriteria);

    console.log('\n\nusersCondition = ', usersCondition);
    console.log('\n\ncategoriesCondition = ', categoriesCondition);
    console.log('\n\nskillsCondition = ', skillsCondition);
    console.log('\n\nusersSkillsCondition = ', usersSkillsCondition);
    console.log('\n\nusersCategoriesCondition = ', usersCategoriesCondition);

    // console.log('\n\nB-S = ', skillReq);
    // console.log('\n\nB-C = ', categoryReq);

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

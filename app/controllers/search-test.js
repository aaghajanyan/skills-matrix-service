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

const findDataTest = async function(request, response, next) {
    const queryWhere = {
        usersCondition: {
            $or: [],
            $and: [],
            $gte: [],
            $lte: [],
        },
        categoriesCondition: {
            $or: [],
            $and: [],
            $gte: [],
            $lte: [],
        },
        skillsCondition: {
            $or: [],
            $and: [],
            $gte: [],
            $lte: [],
        },
        usersSkillsCondition: {
            $or: [],
            $and: [],
            $gte: [],
            $lte: [],
        },
        usersCategoriesCondition: {
            $or: [],
            $and: [],
            $gte: [],
            $lte: [],
        },
    };

    for (const item of request.body) {
        const { type, opCondition, relCondition, items } = item;
        const currWhere = await collectCondition(items, opCondition);
        console.log('\n\n 1 - relCond: ', relCondition);
        const model = await getModel(queryWhere, currWhere, type, opCondition, relCondition, next);
    }


    const {
        usersCondition,
        categoriesCondition,
        skillsCondition,
        usersSkillsCondition,
        usersCategoriesCondition
    } = queryWhere;

    // console.log('\n\n----usersCondition = ', usersCondition);
    // console.log('\n\n----categoriesCondition = ', categoriesCondition);
    // console.log('\n\n----skillsCondition = ', skillsCondition);
    // console.log('\n\n----usersSkillsCondition = ', usersSkillsCondition);
    // console.log('\n\n----usersCategoriesCondition = ', usersCategoriesCondition);


    // console.log('\n\n whereCondition: ', whereCondition);

    const users = await getUsers(queryWhere);

    // console.log(users);
    response.status(200).send({
        success: true,
        message: 'Search',
        users: users
    })
};

const getCondition = (condition, fieldName) => {
    switch(condition) {
        case 'equal':
            if(fieldName == 'experience' || fieldName == 'profficience') {
                return '$gte';
            }
            return '$eq';
        case 'not equal':
            return '$ne';
        case 'greater':
            return '$gte';
        case 'lesser':
            return '$lte';
        case 'or':
            return '$or';
        case 'and':
            return '$and';
    }
}

const collectCondition = (items, opCondition) => {
    const where = [];
    const itemsKeys = Object.keys(items);
    for(item of itemsKeys) {
        const opTypeObj = {};
        const opType = getCondition(opCondition, item);

        console.log("\n\n 1 - item", item);
        opTypeObj[opType] = items[item];
        console.log("\n\n 1 - opTypeObj", opTypeObj);

        const tmpCondition = {};
        tmpCondition[item] = opTypeObj;
        console.log("\n\n 1 - tmpCondition", tmpCondition);

        where.push(tmpCondition);
    }
    console.log('\n\n 1 - where: ', where);
    return where;
}

const getModel = async (queryWhere, currWhere, type, opCondition, relCondition, next) => {

    console.log('\n 2 - getModel -> currWhere: ', currWhere);

    currWhere.map((item) => {
        let keyName = Object.keys(item)[0];
        console.log('\n 2 - getModel -> keyName: ', keyName);
        console.log('\n 2 - getModel -> item: ', item);


        switch(type) {
            case 'branch':
                item.branchName = item.name;
                delete item.name;
                queryWhere.usersCondition[`$${relCondition}`].push(item);
                break;
            case 'position':
                item.position = item.name;
                delete item.name;
                queryWhere.usersCondition[`$${relCondition}`].push(item);
                break;
            case 'user':
                console.log('\n\n JJII: ', item);
                queryWhere.usersCondition[`$${relCondition}`].push(item);
                break;
            case 'skill':
                if(keyName == 'experience' || keyName == 'profficience') {
                    queryWhere.usersSkillsCondition[`$${relCondition}`].push(item);
                    break;
                }
                queryWhere.skillsCondition[`$${relCondition}`].push(item);
                break;
            case 'category':
                if(keyName == 'experience' || keyName == 'profficience') {
                    queryWhere.usersCategoriesCondition[`$${relCondition}`].push(item);
                    break;
                }
                queryWhere.categoriesCondition[`$${relCondition}`].push(item);
                break;
            default: {
                let err = new Error('Invalid type to search employees');
                err.status = 400;
                next(err);
            }
        }
    });
}

// const getModel = async (queryWhere, currWhere, type, opCondition, relCondition, next) => {

    // let keyName = currWhere.map((item) => {
    //     return Object.keys(item)[0]
    // })[0];

//     switch(type) {
//         case 'user':
//         case 'branches':
//         case 'position':
//             queryWhere.usersCondition[`$${relCondition}`].push(currWhere[0]);
//             break;
//         case 'skill':
//             console.log('\n 2 - keyName: ', keyName);
//             if(keyName == 'experience' || keyName == 'profficience' || keyName == 'profficience') {
//                 queryWhere.usersSkillsCondition[`$${relCondition}`].push(currWhere[0]);
//                 break;
//             }
//             queryWhere.skillsCondition[`$${relCondition}`].push(currWhere[0]);
//             break;
//         case 'category':
//             if(keyName == 'experience' || keyName == 'profficience' || keyName == 'profficience') {
//                 queryWhere.usersCategoriesCondition[`$${relCondition}`].push(currWhere[0]);
//                 break;
//             }
//             queryWhere.categoriesCondition[`$${relCondition}`].push(currWhere[0]);
//             break;
//         default: {
//             let err = new Error('Invalid type to search employees');
//             err.status = 400;
//             next(err);
//         }
//     }
// }

const initFinallyWhereQuery = async(whereQuery) => {
    if(whereQuery.$or.length <= 0) {
        delete whereQuery.$or
    }
    if(whereQuery.$and.length <= 0) {
        delete whereQuery.$and
    }
    if(whereQuery.$gte.length <= 0) {
        delete whereQuery.$gte
    }
    if(whereQuery.$lte.length <= 0) {
        delete whereQuery.$lte
    }
}
const getWhereQueryLength = (whereQuery) => {
    let count = 0;
    if('$or' in whereQuery) {
        ++count;
    }
    if('$and' in whereQuery) {
        ++count;
    }
    if('$gte' in whereQuery) {
        ++count;
    }
    if('$lte' in whereQuery) {
        ++count;
    }
    return count > 0;
}


// searchClass = { branchName: { $eq: 'Vanadzor' } };
// searchSection = { branchName: { $eq: 'Erevan' } };
// searchSection1 = { fname: { $ne: 'ATest' } };

// queryWhere = {
//     // $and: [[searchClass], [searchSection1]],
//     // $or: [[searchSection]]
// };
// queryWhere.$and = [[searchClass], [searchSection1]];


const getUsers = async(queryWhere) => {
    const {
        usersCondition,
        categoriesCondition,
        skillsCondition,
        usersSkillsCondition,
        usersCategoriesCondition
    } = queryWhere;

    initFinallyWhereQuery(usersCondition);
    initFinallyWhereQuery(skillsCondition);
    initFinallyWhereQuery(categoriesCondition);
    initFinallyWhereQuery(usersSkillsCondition);
    initFinallyWhereQuery(usersCategoriesCondition);

    console.log('\n\n*** ***usersCondition = ', usersCondition);
    console.log('\n\n*** ***categoriesCondition = ', categoriesCondition);
    console.log('\n\n*** ***skillsCondition = ', skillsCondition);
    console.log('\n\n*** ***usersSkillsCondition = ', usersSkillsCondition);
    console.log('\n\n*** ***usersCategoriesCondition = ', usersCategoriesCondition);


    const userQueryCount = getWhereQueryLength(usersCondition);
    const skillQueryCount = getWhereQueryLength(skillsCondition);
    const categoryQueryCount = getWhereQueryLength(categoriesCondition);
    const userSkillQueryCount = getWhereQueryLength(usersSkillsCondition);
    const userCategoryQueryCount = getWhereQueryLength(usersCategoriesCondition);

    const users = await userModel.findAll({
        where:   queryWhere.usersCondition,
        required: userQueryCount,
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
                where: queryWhere.skillsCondition,
                as: "skills",
                required: skillQueryCount,
                through: {
                    model: userSkillsModel,
                    where: queryWhere.usersSkillsCondition,
                    required: userSkillQueryCount,
                    as: "skillMark",
                    attributes: ["profficience", "experience", "guid"]
                }
            },
            {
                attributes: { exclude: ["id"] },
                model: categoryModel,
                where: queryWhere.categoriesCondition,
                as: "categories",
                required: categoryQueryCount,
                through: {
                    model: userCategoriesModel,
                    where: queryWhere.usersCategoriesCondition,
                    required: userCategoryQueryCount,
                    as: "categoryMark",
                    attributes: ["experience", "profficience", "guid"]
                },
            }
        ]
    });
    return users;
}

module.exports = {
    findDataTest
};

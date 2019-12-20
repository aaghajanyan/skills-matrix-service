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
const User = require("../models/user");



const findDataWithDifferentQueries = async function(request, response, next) {
    try {
        const queryWhere = {
            usersCondition: { $or: [],$and: [], $gte: [], $lte: [] },
            categoriesCondition: { $or: [], $gte: [], $lte: [] },
            skillsCondition: { $or: [], $gte: [], $lte: [] },
            usersSkillsCondition: { $or: [], $gte: [], $lte: [] },
            usersCategoriesCondition: { $or: [], $gte: [], $lte: [] },
        };
        for (const item of request.body) {
            const { type, opCondition, relCondition, items } = item;
            const currWhere = await collectCondition(items, opCondition);
            console.log('\n\n 1 - relCond: ', relCondition);
            console.log('\n\n 1 - currWhere: ', currWhere);
            const model = await getModel(queryWhere, currWhere, type, opCondition, relCondition, next);
        }
        const users = await getUsers(queryWhere);
        response.status(200).send({
            success: true,
            users: users
        })
    } catch(error) {
        response.status(400).send({
            success: false,
            message: 'Could not search data.',
        })
    }
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
        opTypeObj[opType] = items[item];
        const tmpCondition = {};
        tmpCondition[item] = opTypeObj;
        where.push(tmpCondition);
    }
    return where;
}

const getModel = async (queryWhere, currWhere, type, opCondition, relCondition, next) => {
    const $and = [];
    currWhere.map((item) => {
        const keyName = Object.keys(item)[0];
        if (keyName == 'id' && type == 'skill') {
            item.skillId = item.id;
            delete item.id;
        }
        if (keyName == 'id' && type == 'category') {
            item.categoryId = item.id;
            delete item.id;
        }
        $and.push(item);
    });
    switch(type) {
        case 'branch':
            currWhere.map((item) => {
                item.branchName = item.name;
                delete item.name;
                // queryWhere.usersCondition[`$${relCondition}`].push(item);
                queryWhere.usersCondition.$and.push(item);

            });
            break;
        case 'position':
            currWhere.map((item) => {
                item.position = item.name;
                delete item.name;
                // queryWhere.usersCondition[`$${relCondition}`].push(item);
                queryWhere.usersCondition.$and.push(item);
            });
            break;
        case 'user':
            currWhere.map((item) => {
                // queryWhere.usersCondition[`$${relCondition}`].push(item);
                queryWhere.usersCondition.$and.push(item);
            });
            break;
        case 'skill':
            // queryWhere.usersSkillsCondition[`$${relCondition}`].push($and);
            queryWhere.usersSkillsCondition.$or.push($and);
            break;
        case 'category':
            // queryWhere.usersCategoriesCondition[`$${relCondition}`].push(currWhere[0]);
            queryWhere.usersCategoriesCondition.$or.push($and);
            break;
        default: {
            let err = new Error('Invalid type to search employees');
            err.status = 400;
            next(err);
        }
    }
}

const getWhereQueryLength = (whereQuery, isUserQuery = false) => {
    let count = 0;

    console.log(isUserQuery, whereQuery);
    if (isUserQuery) {
        return count;
    }
    if('$and' in whereQuery) {
        count+=whereQuery.$and.length;
    }
    if('$or' in whereQuery) {
        count+=whereQuery.$or.length;
    }
    if('$gte' in whereQuery) {
        count+=whereQuery.$gte.length;
    }
    if('$lte' in whereQuery) {
        count+=whereQuery.$lte.length;
    }
    return count;
}

const initFinallyWhereQuery = async(whereQuery) => {
    if(whereQuery.$or.length <= 0) {
        delete whereQuery.$or
    }
    // if(whereQuery.$and.length <= 0) {
    //     delete whereQuery.$and
    // }
    if(whereQuery.$gte.length <= 0) {
        delete whereQuery.$gte
    }
    if(whereQuery.$lte.length <= 0) {
        delete whereQuery.$lte
    }
}

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

    const userQueryCount = getWhereQueryLength(usersCondition, true);
    const skillQueryCount = getWhereQueryLength(skillsCondition);
    const categoryQueryCount = getWhereQueryLength(categoriesCondition);
    const userSkillQueryCount = getWhereQueryLength(usersSkillsCondition);
    const userCategoryQueryCount = getWhereQueryLength(usersCategoriesCondition);

    const users = await userModel.findAll({
        where:   queryWhere.usersCondition,
        required: userQueryCount,
        attributes: { exclude: ["password", "roleGroupId"] },
        raw: true,
        include: [
            {
                // attributes: { exclude: ["id"] },
                model: skillModel,
                // where: queryWhere.skillsCondition,
                as: "skills",
                required: userSkillQueryCount,

                through: {
                    model: userSkillsModel,
                    where: queryWhere.usersSkillsCondition,
                    required: userSkillQueryCount,
                    as: "skillMark",
                    attributes: ["profficience", "experience", "guid", "userId"],
                }
            },
            {
                // attributes: { exclude: ["id"] },
                model: categoryModel,
                // where: queryWhere.categoriesCondition,
                as: "categories",
                required: true,
                through: {
                    model: userCategoriesModel,
                    where: queryWhere.usersCategoriesCondition,
                    required: true,
                    as: "categoryMark",
                    attributes: ["experience", "profficience", "guid"]
                },
            }
        ],
        // group: [`"user"."guid"`, `"user"."id"`],
        // having: Sequelize.literal(`count("user"."id") = 2`),

    });
    const expectedCount = userQueryCount + userSkillQueryCount + userCategoryQueryCount;
    return filterUsers(users, expectedCount*2);
}

const filterUsers = async(users, expectedCount) => {
    if (users.length < 1 || expectedCount == 1){
        return users;
    }
    const expectedResult = {};
    const usersGuids = [];
    users.forEach(element => {
        if (!expectedResult[element.id]) {
            expectedResult[element.id] = [];
        }
        expectedResult[element.id].push(element);
    });
    const allKeys = Object.keys(expectedResult);
    allKeys.forEach(key => {
        if(expectedResult[key].length == expectedCount) {
            usersGuids.push(expectedResult[key][0].guid);
        }
    });
    const usersList = [];
    for(item of usersGuids) {
        usersList.push(await User.getByGuid(item));
    }
    return usersList;
}

module.exports = {
    findDataWithDifferentQueries
};

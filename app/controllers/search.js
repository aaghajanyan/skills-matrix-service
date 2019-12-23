const {
    user: userModel,
    users_skills: userSkillsModel,
    users_categories: userCategoriesModel,
    skill: skillModel,
    category: categoryModel,
} = require("../sequelize/models");

let skillIdsList = [];
let categoriesIdsList = [];

const search = async function(request, response, next) {
    try {
        skillIdsList = [];
        categoriesIdsList = [];
        const queryWhere = {
            usersCondition: { $or: [], $and: [], $gte: [], $lte: [] },
            categoriesCondition: { $or: [], $gte: [], $lte: [] },
            skillsCondition: { $or: [], $gte: [], $lte: [] },
            usersSkillsCondition: { $or: [], $gte: [], $lte: [] },
            usersCategoriesCondition: { $or: [], $gte: [], $lte: [] }
        };
        for (const item of request.body) {
            const { type, opCondition, relCondition, items } = item;
            const currWhere = await collectCondition(items, opCondition);
            await collectQueryWhere(queryWhere, currWhere, type, opCondition, relCondition, next);
        }
        const users = await getUsers(queryWhere);
        response.status(200).send({
            success: true,
            users: users
        });
    } catch (error) {
        console.log(error);
        response.status(400).send({
            success: false,
            message: "Could not search data."
        });
    }
};

const getCondition = (condition, fieldName) => {
    switch (condition) {
        case "equal":
            if (fieldName == "experience" || fieldName == "profficience") {
                return "$gte";
            }
            return "$eq";
        case "not equal":
            return "$ne";
        case "greater":
            return "$gte";
        case "lesser":
            return "$lte";
        case "or":
            return "$or";
        case "and":
            return "$and";
    }
};

const collectCondition = (items, opCondition) => {
    const where = [];
    const itemsKeys = Object.keys(items);
    for (item of itemsKeys) {
        const opTypeObj = {};
        const opType = getCondition(opCondition, item);
        opTypeObj[opType] = items[item];
        const tmpCondition = {};
        tmpCondition[item] = opTypeObj;
        where.push(tmpCondition);
    }
    return where;
};

/*
 * change key name which received from requiest.body from id to skillId / categoryId
 * receivedType (e.g branch, skill, category ...)
 * neededType
 * obj
 * $and
 * idsList
 */
const changeKeyName = ( keyFromName, keyToName, receivedType, neededType, obj, $and, idsList) => {
    obj.map(item => {
        const keyName = Object.keys(item)[0];
        if (keyName == "id" && receivedType == neededType) {
            item[keyToName] = item[keyFromName];
            delete item[keyFromName];
            idsList.push(item[keyToName].$eq);
        }
        $and.push(item);
    });
};

const changeKeyNameUserType = ( obj, keyFromName, keyToName, needToDelOld, finallyObj) => {
    obj.map(item => {
        if (needToDelOld) {
            item[keyToName] = item[keyFromName];
            delete item[keyFromName];
        }
        finallyObj.push(item);
    });
};

const collectQueryWhere = async (queryWhere, currWhere, type, opCondition, relCondition, next) => {
    const $and = [];
    changeKeyName("id", "skillId", type, "skill", currWhere, $and, skillIdsList);
    changeKeyName("id", "categoryId", type, "category", currWhere, $and, categoriesIdsList);

    switch (type) {
        case "branch":
            changeKeyNameUserType(currWhere, "name", "branchName", true, queryWhere.usersCondition.$and);
            break;
        case "position":
            changeKeyNameUserType(currWhere, "name", "position", true, queryWhere.usersCondition.$and);
            break;
        case "user":
            changeKeyNameUserType(currWhere, "name", "position", false, queryWhere.usersCondition.$and);
            break;
        case "skill":
            queryWhere.usersSkillsCondition.$or.push($and);
            break;
        case "category":
            queryWhere.usersCategoriesCondition.$or.push($and);
            break;
        default: {
            let err = new Error("Invalid type to search employees");
            err.status = 400;
            next(err);
        }
    }
};

const getWhereQueryLength = (whereQuery, isUserQuery = false) => {
    let count = 0;
    console.log(isUserQuery, whereQuery);
    if (isUserQuery) {
        return count;
    }
    if ("$and" in whereQuery) {
        count += whereQuery.$and.length;
    }
    if ("$or" in whereQuery) {
        count += whereQuery.$or.length;
    }
    if ("$gte" in whereQuery) {
        count += whereQuery.$gte.length;
    }
    if ("$lte" in whereQuery) {
        count += whereQuery.$lte.length;
    }
    return count;
};

const initFinallyWhereQuery = async (whereQuery, isUserQuery = false) => {
    if (whereQuery.$or.length <= 0) {
        delete whereQuery.$or;
    }
    if (isUserQuery && whereQuery.$and.length <= 0) {
        delete whereQuery.$and;
    }
    if (whereQuery.$gte.length <= 0) {
        delete whereQuery.$gte;
    }
    if (whereQuery.$lte.length <= 0) {
        delete whereQuery.$lte;
    }
};

const getUsers = async (queryWhere) => {
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
        attributes: { exclude: ["password", "roleGroupId"] },
        include: [
            {
                attributes: { exclude: ["id"] },
                model: skillModel,
                as: "skills",
                required: userSkillQueryCount > 0,
                through: {
                    model: userSkillsModel,
                    where: usersSkillsCondition,
                    required: userSkillQueryCount > 0,
                    as: "skillMark",
                    attributes: { exclude: ["id"] },
                }
            },
            {
                attributes: { exclude: ["id"] },
                model: categoryModel,
                as: "categories",
                required: userCategoryQueryCount > 0,
                through: {
                    model: userCategoriesModel,
                    where: usersCategoriesCondition,
                    required: userCategoryQueryCount > 0,
                    as: "categoryMark",
                    attributes: { exclude: ["id"] },
                }
            }
        ]
    });
    return await filterUsers(users);
};

const initializeActualSkills = (users, actualSkills, actualCategories) => {
    users.forEach(user => {
        if (!actualSkills[user.id]) {
            actualSkills[user.id] = [];
        }
        user.skills.forEach(skill => {
            actualSkills[user.id].push(skill.id);
        })

        if (!actualCategories[user.id]) {
            actualCategories[user.id] = [];
        }
        user.categories.forEach(category => {
            actualCategories[user.id].push(category.id);
        })
    });
}

const filterUsers = async (users) => {
    const actualSkills = {};
    const actualCategories = {};
    initializeActualSkills(users, actualSkills, actualCategories);

    const  actualSkillsKeys = Object.keys(actualSkills);
    const  actualCategoriesKeys = Object.keys(actualCategories);

    if (skillIdsList.length > 0) {
        actualSkillsKeys.map(key => {
            if(actualSkills[key].length != skillIdsList.length)  {
                users.splice(users.findIndex(user => user.id === key), 1);
            }
        })
    }
    if (categoriesIdsList.length > 0) {
        actualCategoriesKeys.map(key => {
            if(actualCategories[key].length != categoriesIdsList.length)  {
                users.splice(users.findIndex(user => user.id === key), 1);
            }
        })
    }
    return users;
};

module.exports = {
    search
};

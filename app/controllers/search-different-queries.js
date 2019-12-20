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

let skillIdsList = [];
let categoriesIdsList = [];

const searchData = async function(request, response, next) {
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

const calculatePossibleCombination = () => {
    try {
        const count = skillIdsList.flatMap(skillItem =>
            categoriesIdsList.map(catItem => skillItem + catItem)
        );
        return count.length;
    } catch (error) {
        console.log(error);
    }
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

const getUsers = async queryWhere => {
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
    const skillQueryCount = getWhereQueryLength(skillsCondition);
    const categoryQueryCount = getWhereQueryLength(categoriesCondition);
    const userSkillQueryCount = getWhereQueryLength(usersSkillsCondition);
    const userCategoryQueryCount = getWhereQueryLength(
        usersCategoriesCondition
    );

    const users = await userModel.findAll({
        where: queryWhere.usersCondition,
        required: userQueryCount,
        attributes: { exclude: ["password", "roleGroupId"] },
        raw: true,
        include: [
            {
                // attributes: { exclude: ["id"] },
                attributes: ["id"],
                model: skillModel,
                // where: queryWhere.skillsCondition,
                as: "skills",
                required: userSkillQueryCount,
                through: {
                    attributes: [],
                    model: userSkillsModel,
                    where: queryWhere.usersSkillsCondition,
                    required: userSkillQueryCount,
                    as: "skillMark"
                    // attributes: ["profficience", "experience", "guid", "userId"],
                }
            },
            {
                // attributes: { exclude: ["id"] },
                attributes: ["id"],
                model: categoryModel,
                // where: queryWhere.categoriesCondition,
                as: "categories",
                required: true,
                through: {
                    attributes: [],
                    model: userCategoriesModel,
                    where: queryWhere.usersCategoriesCondition,
                    required: true,
                    as: "categoryMark"
                    // attributes: ["experience", "profficience", "guid"]
                }
            }
        ]
        // group: [`"user"."guid"`, `"user"."id"`],
        // having: Sequelize.literal(`count("user"."id") = 2`),
    });
    // const expectedCount = userQueryCount + userSkillQueryCount + userCategoryQueryCount;
    const expectedCount = calculatePossibleCombination();

    return filterUsers(users, expectedCount, queryWhere);
};

const filterUsers = async (users, expectedCount, queryWhere) => {
    if (users.length < 1 || expectedCount == 1) {
        return users;
    }
    const expectedResult = {};
    const usersGuids = [];

    /* collect users guids */
    users.forEach(element => {
        if (!expectedResult[element.id]) {
            expectedResult[element.id] = [];
        }
        expectedResult[element.id].push(element);
    });

    /* delete wrong users */
    let allKeys = Object.keys(expectedResult);
    allKeys.forEach(key => {
        if (expectedResult[key].length != expectedCount) {
            delete expectedResult[key];
        }
    });

    /* check users list leave only correct users*/
    allKeys = Object.keys(expectedResult);
    allKeys.forEach(key => {
        for (let i = 0; i < expectedResult[key].length; ++i) {
            let user = expectedResult[key][i];
            if (
                !skillIdsList.includes(user["skills.id"]) ||
                !categoriesIdsList.includes(user["categories.id"])
            ) {
                delete expectedResult[key][i];
            }
        }
    });

    /* collect users guids */
    allKeys.forEach(key => {
        if (expectedResult[key].length == expectedCount) {
            usersGuids.push(expectedResult[key][0].guid);
        }
    });

    /* get users */
    const usersList = [];
    for (item of usersGuids) {
        usersList.push(await User.getByGuid(item));
    }
    return usersList;
};

module.exports = {
    searchData
};

const { Constants } = require("../constants/Constants");
const Category = require("../models/category");
const Skill = require("../models/skill");

const getCondition = (condition, fieldName) => {
    switch (condition) {
        case Constants.Controllers.Search.EQUAL:
            if (fieldName == Constants.Controllers.Search.EXPERIENCE ||
                fieldName == Constants.Controllers.Search.PROFFICIENCE) {
                return Constants.Controllers.Search.Op.GTE;
            }
            return Constants.Controllers.Search.Op.EQ;
        case Constants.Controllers.Search.NOT_EQUAL:
            return Constants.Controllers.Search.Op.NE;
        case Constants.Controllers.Search.GREATER:
            return Constants.Controllers.Search.Op.GTE;
        case Constants.Controllers.Search.LESSER:
            return Constants.Controllers.Search.Op.LTE;
        case Constants.Controllers.Search.OR:
            return Constants.Controllers.Search.Op.OR;
        case Constants.Controllers.Search.AND:
            return Constants.Controllers.Search.Op.AND;
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

const changeGuidToId = async ( item, keyName, model, next) => {
        const id = item[keyName].$eq;
        const data = model == Constants.Keys.skill ? await Skill.find({guid: id}) : await Category.find({guid: id});
        item[keyName].$eq = data.id;
}
/*
 * change key name which received from requiest.body from id to skillId / categoryId
 * receivedType (e.g branch, skill, category ...)
 * neededType
 * obj
 * $and
 * idsList
 */
const changeKeyName = async ( keyFromName, keyToName, receivedType, neededType, obj, $and, idsList, next) => {
    for(item of obj) {
        const keyName = Object.keys(item)[0];
        if (keyName == Constants.Keys.id) {
            if (neededType == Constants.Keys.skill) {
                await changeGuidToId( item, keyName, Constants.Keys.skill, next);
            }
            if (neededType == Constants.Keys.category) {
                await changeGuidToId( item, keyName, neededType, Constants.Keys.category, next);
            }
            if (receivedType == neededType) {
                item[keyToName] = item[keyFromName];
                delete item[keyFromName];
                idsList.push(item[keyToName].$eq);
            }
        }
        $and.push(item);
    }
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

const collectQueryWhere = async (queryWhere, currWhere, type, skillIdsList, categoriesIdsList, next) => {
    const $and = [];
    switch (type) {
        case Constants.Keys.branch:
            changeKeyNameUserType(currWhere, Constants.Keys.name, Constants.Keys.branchName, true, queryWhere.usersCondition.$and);
            break;
        case Constants.Keys.position:
            changeKeyNameUserType(currWhere, Constants.Keys.name, Constants.Keys.position, true, queryWhere.usersCondition.$and);
            break;
        case Constants.Keys.user:
            changeKeyNameUserType(currWhere, Constants.Keys.name, Constants.Keys.position, false, queryWhere.usersCondition.$and);
            break;
        case Constants.Keys.skill:
            await changeKeyName(Constants.Keys.id, Constants.Keys.skillId, type, Constants.Keys.skill, currWhere, $and, skillIdsList, next);
            queryWhere.usersSkillsCondition.$or.push($and);
            break;
        case Constants.Keys.category:
            await changeKeyName(Constants.Keys.id, Constants.Keys.categoryId, type, Constants.Keys.category, currWhere, $and, categoriesIdsList, next);
            queryWhere.usersCategoriesCondition.$or.push($and);
            break;
        default: {
            let err = new Error(Constants.Controllers.Search.INVALID_TYPE_TO_SEARCH);
            err.status = 400;
            next(err);
        }
    }
};

const getWhereQueryLength = (whereQuery, isUserQuery = false) => {
    let count = 0;
    if (isUserQuery) {
        return count;
    }
    if (Constants.Controllers.Search.Op.AND in whereQuery) {
        count += whereQuery.$and.length;
    }
    if (Constants.Controllers.Search.Op.OR in whereQuery) {
        count += whereQuery.$or.length;
    }
    if (Constants.Controllers.Search.Op.GTE in whereQuery) {
        count += whereQuery.$gte.length;
    }
    if (Constants.Controllers.Search.Op.LTE in whereQuery) {
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

const filterUsers = async (users, skillIdsList, categoriesIdsList) => {
    const actualSkills = {};
    const actualCategories = {};
    initializeActualSkills(users, actualSkills, actualCategories);
    filterBy(users, skillIdsList, actualSkills);
    filterBy(users, categoriesIdsList, actualCategories);
    return users;
};

const filterBy = async (users, expectedSkillOrCat, actualSkillOrCat) => {
    const  actualKeys = Object.keys(actualSkillOrCat);
    if (expectedSkillOrCat.length > 0) {
        actualKeys.map(key => {
            if(actualSkillOrCat[key].length != expectedSkillOrCat.length)  {
                users.splice(users.findIndex(user => user.id == key),1);
            } else {
                actualSkillOrCat[key].sort(function(a, b){return a - b});
                expectedSkillOrCat.sort(function(a, b){return a - b});
                const isEqual = (JSON.stringify(actualSkillOrCat[key]) == JSON.stringify(expectedSkillOrCat));
                if (!isEqual) {
                    users.splice(users.findIndex(user => user.id == key), 1);
                }
            }
        })
    }
}

module.exports = {
    collectCondition,
    collectQueryWhere,
    getWhereQueryLength,
    initFinallyWhereQuery,
    initializeActualSkills,
    filterUsers
}

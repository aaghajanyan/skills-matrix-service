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

const findDataWithDifferentQueries = async function(request, response, next) {
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
        console.log('\n\n 1 - currWhere: ', currWhere);

        const model = await getModel(queryWhere, currWhere, type, opCondition, relCondition, next);
    }


    const {
        usersCondition,
        categoriesCondition,
        skillsCondition,
        usersSkillsCondition,
        usersCategoriesCondition
    } = queryWhere;


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

const collectRightQuery = () => {

}

const getModel = async (queryWhere, currWhere, type, opCondition, relCondition, next) => {
    console.log('\n 2 - getModel -> currWhere: ', currWhere);
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
        console.log('\n\n 2- ITEM = ', item);

        $and.push(item);
    });

    console.log('\n\n 2- currWhere = ', currWhere);
    console.log('\n\n 2- TMP AND = ', $and);

        switch(type) {
            case 'branch':
                currWhere.map((item) => {
                    item.branchName = item.name;
                    delete item.name;
                    queryWhere.usersCondition[`$${relCondition}`].push(item);
                });
                break;
            case 'position':
                currWhere.map((item) => {
                    item.position = item.name;
                    delete item.name;
                    queryWhere.usersCondition[`$${relCondition}`].push(item);
                });
                break;
            case 'user':
                currWhere.map((item) => {
                    queryWhere.usersCondition[`$${relCondition}`].push(item);
                });
                console.log('\n\n JJII: ', item);
                break;
            case 'skill':
                queryWhere.usersSkillsCondition[`$${relCondition}`].push($and);
                break;
            case 'category':
                queryWhere.usersCategoriesCondition[`$${relCondition}`].push(currWhere[0]);
                break;
            default: {
                let err = new Error('Invalid type to search employees');
                err.status = 400;
                next(err);
            }
        }
}

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

    console.log('\n\n*** FINAL  ***\n');
    console.log('\n*** ***usersCondition = ', usersCondition);
    console.log('\n*** ***categoriesCondition = ', categoriesCondition);
    console.log('\n*** ***skillsCondition = ', skillsCondition);
    console.log('\n*** ***usersSkillsCondition = ', usersSkillsCondition);
    console.log('\n*** ***usersCategoriesCondition = ', usersCategoriesCondition);
    console.log('\n*** END  ***\n\n');


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
                // attributes: { exclude: ["id"] },
                model: skillModel,
                where: queryWhere.skillsCondition,
                as: "skills",
                required: userSkillQueryCount > 0,

                through: {
                    model: userSkillsModel,
                    where: queryWhere.usersSkillsCondition,
                    required: userSkillQueryCount,
                    as: "skillMark",
                    attributes: ["profficience", "experience", "guid", "userId"],
                    group: "userId",
                    having: Sequelize.literal(`count(userId) = 2`),
                }
            },
            // {
            //     // attributes: { exclude: ["id"] },
            //     model: categoryModel,
            //     // where: queryWhere.categoriesCondition,
            //     as: "categories",
            //     required: userCategoryQueryCount > 0,
            //     through: {
            //         model: userCategoriesModel,
            //         where: queryWhere.usersCategoriesCondition,
            //         required: userCategoryQueryCount,
            //         as: "categoryMark",
            //         attributes: ["experience", "profficience", "guid"]
            //     },
            // }
        ],

    });
    return users;
}

module.exports = {
    findDataWithDifferentQueries
};

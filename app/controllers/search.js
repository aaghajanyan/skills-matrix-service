const {
    OK,
    INTERNAL_SERVER_ERROR,
    getStatusText
} = require("http-status-codes");
const User = require("../models/user");
const { Constants } = require("../constants/Constants");
const { collectCondition, collectQueryWhere } = require("../helper/searchHelper");
const logger = require("../helper/logger");

let skillIdsList = [];
let categoriesIdsList = [];

const search = async function(request, response, next) {
    try {
        skillIdsList = [];
        categoriesIdsList = [];
        const queryWhere = {
            usersCondition: { $or: [], $and: [], $gte: [], $lte: [] },
            branchCondition: { $or: [], $and: [], $gte: [], $lte: [] },
            positionCondition: { $or: [], $and: [], $gte: [], $lte: [] },
            categoriesCondition: { $or: [], $gte: [], $lte: [] },
            skillsCondition: { $or: [], $gte: [], $lte: [] },
            usersSkillsCondition: { $or: [], $gte: [], $lte: [] },
            usersCategoriesCondition: { $or: [], $gte: [], $lte: [] }
        };
        for (const item of request.body) {
            const { type, opCondition, relCondition, items } = item;
            const currWhere = await collectCondition(items, opCondition);
            await collectQueryWhere(queryWhere, currWhere, type, skillIdsList, categoriesIdsList, next);
        }
        const users = await User.searchUser(queryWhere, skillIdsList, categoriesIdsList);
        return response.status(OK).json({
            success: true,
            users: users
        });
    } catch (error) {
        console.log(error)
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.Controllers.Search.COULD_NOT_SEARCH_DATA}`
        });
    }
};

module.exports = {
    search
};

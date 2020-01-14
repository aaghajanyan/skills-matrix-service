const {
    OK,
    INTERNAL_SERVER_ERROR,
    getStatusText
} = require("http-status-codes");
const User = require("../models/user");
const { Constants } = require("../constants/Constants");
const { collectCondition, collectQueryWhere } = require("../helper/searchHelper");
const logger = require("../helper/logger");
const db = require("../sequelize/models");
const SearchUser = require("../models/search");
let skillIdsList = [];
let categoriesIdsList = [];


const searchUsers = async function(request, response) {
    try {
        let sqlCmd = SearchUser.collectSearchQuery(request.body);
        console.log("FINAL CMD = ", sqlCmd);
        const users = await db.sequelize.query(sqlCmd);
        response.send(users[0]);
    } catch (error) {
        console.log(error);
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER.toLowerCase()
            )}`
        });
    }
};

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
    search,
    searchUsers
};

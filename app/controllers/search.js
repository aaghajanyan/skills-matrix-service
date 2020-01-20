const {
    OK,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    getStatusText
} = require("http-status-codes");
const User = require("../models/user");
const { Constants } = require("../constants/Constants");
const logger = require("../helper/logger");
const db = require("../sequelize/models");
const SearchUser = require("../models/search");
const { validateEmptyQueryBodySchema } = require('../validation/search');

const decodeQuery = async function(encodedQuery, response) {
    try {
        return JSON.parse(Buffer.from(encodedQuery, 'base64').toString('ascii'));
    } catch(error) {
        logger.error(error, '');
        return response.status(BAD_REQUEST).json({
            success: false,
            message: `${Constants.parse(
                Constants.Controllers.Search.QUERY_PARAM_IS_INVALID,
                Constants.Controllers.Search.QUERY_PARAM_NAME
            )}`
        });
    }
}

const validateIsQueryEmptyObject = async function(decodedQueryJson, response) {
    if (decodedQueryJson) {
        const error = validateEmptyQueryBodySchema(decodedQueryJson);
        if (error == null) {
            return response.status(OK).json({
                success: true,
                message: '',
                result: []
            });
        }
    }
}

const validateFinallyObject = async function(sqlCmd, response) {
    if(sqlCmd.error != undefined && sqlCmd.error.isError) {
        return response.status(BAD_REQUEST).json({
            success: false,
            message: sqlCmd.error.message,
            result:[]
        })
    }
}

const searchUsers = async function(request, response, next) {
    try {
        const decodedQueryJson = await decodeQuery(request.params.search_query, response);
        if (response.headersSent) {
            return;
        }
        const searchUser = new SearchUser();
        validateIsQueryEmptyObject(decodedQueryJson, response);
        if (response.headersSent) {
            return;
        }
        const sqlCmd = searchUser.collectSearchQuery(decodedQueryJson);
        validateFinallyObject(sqlCmd, response);
        if (response.headersSent) {
            return;
        }
        const usersData = await db.sequelize.query(sqlCmd);
        const usersIds = usersData[0].map(userData => {
            return userData.id;
        });
        const whereCondition = {
            id: usersIds
        }
        const foundUsers = await User.getUsers(whereCondition);
        return response.status(OK).json({
            success: true,
            message: {},
            result: foundUsers
        });

    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_FIND,
                Constants.Controllers.TypeNames.USER.toLowerCase()
            )}`
        });
    }
};

module.exports = {
    searchUsers
};

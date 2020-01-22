const {
    OK,
    INTERNAL_SERVER_ERROR
} = require('http-status-codes');
const User = require('../models/user');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const db = require('../sequelize/models');
const SearchUser = require('../models/search');
const { validateEmptyQueryBodySchema } = require('../validation/search');
const Error = require('../errors/Error');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const decodeQuery = async function(encodedQuery) {
    try {
        return {
            success: true,
            error: false,
            decodedQueryJson: JSON.parse(
                Buffer.from(encodedQuery, 'base64').toString('ascii')
            ),
        };
    } catch (error) {
        logger.error(error);
        return {
            success: false,
            error: true,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.Search.QUERY_PARAM_IS_INVALID,
                Constants.Controllers.Search.QUERY_PARAM_NAME
            )}`,
        };
    }
};

const validateIsQueryEmptyObject = async function(decodedQueryJson) {
    if (decodedQueryJson) {
        const errorMsg = validateEmptyQueryBodySchema(decodedQueryJson);
        const obj = {
            success: true,
            error: false,
            message: errorMsg,
            result: [],
        };
        obj.error = errorMsg ? false : true;
        return obj;
    }
};

const validateFinallyObject = async function(sqlCmd) {
    return {
        success: sqlCmd.error && sqlCmd.error.isError ? false : true,
        message:
            sqlCmd.error && sqlCmd.error.isError ? sqlCmd.error.message : '',
        result: [],
    };
};

const searchUsers = async function(request, response, next) {
    try {
        const decodedQueryObj = await decodeQuery(request.params.search_query);
        if (decodedQueryObj.error) {
            next(new Error(400, decodedQueryObj.message));
            return;
        }
        const searchUser = new SearchUser();
        const isEmptyQuery = await validateIsQueryEmptyObject(
            decodedQueryObj.decodedQueryJson
        );
        if (isEmptyQuery.error) {
            next(new Error(200));
            return;
        }
        const sqlCmd = searchUser.collectSearchQuery(
            decodedQueryObj.decodedQueryJson
        );
        const finallyObjValidResult = await validateFinallyObject(sqlCmd);
        if (!finallyObjValidResult.success) {
            next(new Error(200, finallyObjValidResult.message));
            return;
        }
        const usersData = await db.sequelize.query(sqlCmd);
        const usersIds = usersData[0].map(userData => {
            return userData.id;
        });
        const whereCondition = {
            id: usersIds,
        };
        const foundUsers = await User.getUsers(whereCondition);
        return response.status(OK).json({
            success: true,
            message: {},
            result: foundUsers,
        });
    } catch (error) {
        console.log(error)
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_FIND,
                Constants.Controllers.TypeNames.USER.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    searchUsers,
};

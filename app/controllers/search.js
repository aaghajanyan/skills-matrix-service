const util = require('util');
const {OK, INTERNAL_SERVER_ERROR, BAD_REQUEST} = require('http-status-codes');
const {validateEmptyQueryBodySchema} = require('../validation/search');
const {Constants} = require('../constants/Constants');
const db = require('../sequelize/models');
const User = require('../models/user');
const SearchUser = require('../models/search');
const CustomError = require('../errors/CustomError');
const logger = require('../helper/logger');

const decodeQuery = (encodedQuery) => {
    try {
        return {
            success: true,
            error: false,
            decodedQueryJson: JSON.parse(Buffer.from(encodedQuery, 'base64').toString('ascii'))
        };
    } catch(error) {
        logger.error(error);
        return {
            success: false,
            error: true,
            message: `${util.format(Constants.Controllers.Search.QUERY_PARAM_IS_INVALID, Constants.Controllers.Search.QUERY_PARAM_NAME)}`
        };
    }
};

const validateIsQueryEmptyObject = (decodedQueryJson) => {
    if(decodedQueryJson) {
        const errorMsg = validateEmptyQueryBodySchema(decodedQueryJson);
        const obj = {
            success: true,
            error: false,
            message: errorMsg,
            result: []
        };
        obj.error = errorMsg ? false : true;
        return obj;
    }
};

const validateFinallyObject = (sqlCmd) => {
    let conditionPart = sqlCmd.split('where ')[1];
    let responseObj = {
        success: false,
        message: '',
        result: []
    };
    if(!conditionPart.match(/[A-z]/g)) {
        return responseObj;
    }
    responseObj.success = sqlCmd.error && sqlCmd.error.isError ? false : true;
    responseObj.message = sqlCmd.error && sqlCmd.error.isError ? sqlCmd.error.message : '';
    return responseObj;
};

module.exports.searchUsers = async (request, response, next) => {
    try {
        const decodedQueryObj = await decodeQuery(request.params.search_query);
        if(decodedQueryObj.error) {
            next(new CustomError(BAD_REQUEST, decodedQueryObj.message));
            return;
        }
        const searchUser = new SearchUser();
        const isEmptyQuery = await validateIsQueryEmptyObject(decodedQueryObj.decodedQueryJson);
        if(isEmptyQuery.error) {
            next(new CustomError());
            return;
        }
        const sqlCmd = searchUser.collectSearchQuery(decodedQueryObj.decodedQueryJson);
        const finallyObjValidResult = await validateFinallyObject(sqlCmd);
        if(!finallyObjValidResult.success) {
            next(new CustomError(OK, finallyObjValidResult.message));
            return;
        }

        const usersData = await db.sequelize.query(sqlCmd);
        const usersIds = usersData[0].map(userData => {
            return userData.id;
        });
        const whereCondition = {id: usersIds};
        const foundUsers = await User.getUsers(whereCondition);
        return response.status(OK).json({
            success: true,
            message: {},
            result: foundUsers
        });
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${util.format(Constants.ErrorMessages.COULD_NOT_FIND, Constants.TypeNames.USER.toLowerCase())}`
        });
    }
};

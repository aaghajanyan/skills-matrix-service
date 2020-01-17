const {
    OK,
    INTERNAL_SERVER_ERROR,
    getStatusText
} = require("http-status-codes");
const User = require("../models/user");
const { Constants } = require("../constants/Constants");
const logger = require("../helper/logger");
const db = require("../sequelize/models");
const SearchUser = require("../models/search");

const searchUsers = async function(request, response, next) {
    try {
        const searchUser = new SearchUser();
        let sqlCmd = searchUser.collectSearchQuery(request.body);
        if(sqlCmd.error != undefined && sqlCmd.error.isError) {
            response.send(sqlCmd.error.message)
            return
        }
        const usersData = await db.sequelize.query(sqlCmd);
        const usersIds = usersData[0].map(userData => {
            return userData.id;
        });
        const whereCondition = {
            id: usersIds
        }
        const foundUsers = await User.getUsers(whereCondition);
        return response.status(OK).send({
            errorMsg: '',
            result: foundUsers
        });
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
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

module.exports = {
    searchUsers
};

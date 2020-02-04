const jwt = require('jsonwebtoken');
const {OK, INTERNAL_SERVER_ERROR} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const dashboardData = require('../models/dashboardInfo');
const logger = require('../helper/logger');

module.exports.getDashboardData = async (request, response) => {
    try {
        const token = request.header("Authorization").split('Bearer ')[1];
        const user = await dashboardData.topSkillsAndNeedToImprove(jwt.decode(token).guid);
        const getSimilarUsers = await dashboardData.peopleWithSimilarSkills(jwt.decode(token).guid);
        return response.status(OK).json({ topSkilsSort: user.topSkilsSort, needToImproveSort: user.needToImproveSort , getSimilarUsers, categoriesUsers: user.categoriesUsers});
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.USER.toLowerCase(), request.params.userGuid));
    }
};
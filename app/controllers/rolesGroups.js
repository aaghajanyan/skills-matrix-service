const {OK, INTERNAL_SERVER_ERROR} = require('http-status-codes');
const {couldNotGetCriteria} = require('../helper/errorResponseBodyBuilder');
const {Constants} = require('../constants/Constants');
const RoleGroup = require('../models/rolesGroups');
const logger = require('../helper/logger');

module.exports.getRoleGroup = async (request, response) => {
    try {
        const roleGroup = await RoleGroup.find({guid: request.params.guid});
        return response.status(OK).json(roleGroup);
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.ROLE_GROUP.toLowerCase(), request.params.guid));
    }
};

module.exports.getRoleGroups = async (request, response) => {
    try {
        const roleGroup = await RoleGroup.findAll();
        response.status(OK).json(roleGroup);
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.ROLE_GROUPS.toLowerCase()));
    }
};

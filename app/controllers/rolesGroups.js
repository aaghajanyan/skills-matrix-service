const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const RoleGroup = require('../models/rolesGroups');
const logger = require('../helper/logger');
const { couldNotGetCriteria } = require('../helper/errorResponseBodyBuilder');

const getRoleGroup = async function(request, response) {
    try {
        const roleGroup = await RoleGroup.find({ guid: request.params.guid });
        return response.status(OK).json(roleGroup);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.ROLE_GROUP.toLowerCase(), request.params.guid));
    }
};

const getRoleGroups = async function(request, response) {
    try {
        const roleGroup = await RoleGroup.findAll();
        response.status(OK).json(roleGroup);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.ROLE_GROUPS.toLowerCase()));
    }
};

module.exports = {
    getRoleGroup,
    getRoleGroups,
};

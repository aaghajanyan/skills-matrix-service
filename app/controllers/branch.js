const { OK, INTERNAL_SERVER_ERROR, ACCEPTED, CREATED } = require('http-status-codes');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const { Constants } = require('../constants/Constants');
const Branch = require('../models/branch');
const logger = require('../helper/logger');

module.exports.getBranches = async (request, response) => {
    try {
        const branches = await Branch.findAll();
        return response.status(OK).json(branches);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.BRANCHES.toLowerCase()));
    }
};

module.exports.getBranch = async (request, response) => {
    try {
        const branch = await Branch.find({ guid: request.params.guid });
        response.status(OK).json(branch);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.params.guid));
    }
};

module.exports.addBranch = async (request, response) => {
    try {
        const { branch, isNewRecord } = await Branch.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response.status(OK).json(responseBuilder.alreadyExistsCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.body.name));
        }
        return response.status(CREATED).json({ branch });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotAddCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.body.name));
    }
};

module.exports.updateBranch = async (request, response) => {
    try {
        await Branch.update(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.params.guid));
    }
};

module.exports.deleteBranch = async (request, response) => {
    try {
        await Branch.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.params.guid));
    }
};

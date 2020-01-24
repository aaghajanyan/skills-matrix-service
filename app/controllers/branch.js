const { OK, INTERNAL_SERVER_ERROR, ACCEPTED, CREATED } = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const Branch = require('../models/branch');
const { couldNotGetCriteria, couldNotAddCriteria, couldNotUpdateCriteria, couldNotDeleteCriteria } = require('../helper/errorResponseBodyBuilder');

const getBranches = async function(request, response) {
    try {
        const branches = await Branch.findAll();
        return response.status(OK).json(branches);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.BRANCHES.toLowerCase()));
    }
};

const getBranch = async function(request, response) {
    try {
        const branch = await Branch.find({ guid: request.params.guid });
        response.status(OK).json(branch);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.params.guid));
    }
};

const addBranch = async function(request, response) {
    try {
        const { branch, isNewRecord } = await Branch.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response.status(OK).json(alreadyExistsCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.body.name));
        }
        return response.status(CREATED).json({ branch });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotAddCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.body.name));
    }
};

const updateBranch = async function(request, response) {
    try {
        await Branch.update(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotUpdateCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.params.guid));
    }
};

const deleteBranch = async function(request, response) {
    try {
        await Branch.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotDeleteCriteria(Constants.TypeNames.BRANCH.toLowerCase(), request.params.guid));
    }
};

module.exports = {
    getBranch,
    getBranches,
    updateBranch,
    deleteBranch,
    addBranch,
};

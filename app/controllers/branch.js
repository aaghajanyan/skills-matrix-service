const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const Branch = require('../models/branch');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getBranches = async function(request, response) {
    try {
        const branches = await Branch.findAll();
        return response.status(OK).json(branches);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.BRANCH.toLowerCase()
            )}`,
        });
    }
};

const getBranch = async function(request, response) {
    try {
        const branch = await Branch.find({ guid: request.params.guid });
        response.status(OK).json(branch);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.BRANCH.toLowerCase()
            )}`,
        });
    }
};

const addBranch = async function(request, response) {
    try {
        const { branch, isNewRecord } = await Branch.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response.status(OK).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.ALREADY_EXISTS,
                    Constants.TypeNames.BRANCH
                )}`,
            });
        }
        return response.status(CREATED).json({
            branch,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_ADD,
                Constants.TypeNames.BRANCH.toLowerCase()
            )}`,
        });
    }
};

const updateBranch = async function(request, response) {
    try {
        await Branch.update(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_UPDATE,
                Constants.TypeNames.BRANCH.toLowerCase()
            )}`,
        });
    }
};

const deleteBranch = async function(request, response) {
    try {
        await Branch.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_DELETE,
                Constants.TypeNames.BRANCH.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getBranch,
    getBranches,
    updateBranch,
    deleteBranch,
    addBranch,
};

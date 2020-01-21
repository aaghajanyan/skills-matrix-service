const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED
} = require("http-status-codes");
const { Constants } = require("../constants/Constants");
const logger = require("../helper/logger");
const Branch = require("../models/branch");
const ErrorMessageParser = require("../errors/ErrorMessageParser");

const getBranches = async function(request, response) {
    try {
        const branches = await Branch.findAll();
        return response.status(OK).json(branches);
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.BRANCH.toLowerCase()
            )}`
        });
    }
};

const getBranch = async function(request, response) {
    try {
        const branch = await Branch.find({ guid: request.params.guid });
        response.status(OK).json(branch);
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.BRANCH.toLowerCase()
            )}`
        });
    }
};

const addBranch = async function(request, response) {
    try {
        const { branch, isNewRecord } = await Branch.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                    Constants.Controllers.TypeNames.BRANCH
                )}`
            });
        }
        return response.status(CREATED).json({
            branch
        });
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.BRANCH.toLowerCase()
            )}`
        });
    }
};

const updateBranch = async function(request, response) {
    try {
        await Branch.update(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.BRANCH.toLowerCase()
            )}`
        });
    }
};

const deleteBranch = async function(request, response) {
    try {
        const branch = await Branch.find({ guid: request.params.guid });
        if (!branch) {
            return response.status(CONFLICT).json({
                success: false,
                message: ErrorMessageParser.elementDoesNotExist(
                    Constants.Controllers.TypeNames.BRANCH,
                    request.params.guid,
                    Constants.Keys.id
                )
            });
        }
        branch.destroy();
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.BRANCH.toLowerCase()
            )}`
        });
    }
};

module.exports = {
    getBranch,
    getBranches,
    updateBranch,
    deleteBranch,
    addBranch
};

const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const Criteria = require('../models/criteria');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getCriteries = async function(_, response) {
    try {
        const criteries = await Criteria.findAll();
        return response.status(OK).json(criteries);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.CRITERIA.toLowerCase()
            )}`,
        });
    }
};

const getCriteria = async function(request, response) {
    try {
        const criteria = await Criteria.find({ guid: request.params.guid });
        response.status(OK).json(criteria);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.CRITERIA.toLowerCase()
            )}`,
        });
    }
};

const addCriteria = async function(request, response) {
    try {
        const { criteria, isNewRecord } = await Criteria.findOrCreate({
            name: request.body.name,
            type: request.body.type,
        });
        if (!isNewRecord) {
            return response.status(OK).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.ALREADY_EXISTS,
                    Constants.TypeNames.CRITERIA
                )}`,
            });
        }
        return response.status(CREATED).json({
            criteria,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_ADD,
                Constants.TypeNames.CRITERIA.toLowerCase()
            )}`,
        });
    }
};

const updateCriteria = async function(request, response) {
    try {
        await Criteria.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_UPDATE,
                Constants.TypeNames.CRITERIA.toLowerCase()
            )}`,
        });
    }
};

const deleteCriteria = async function(request, response) {
    try {
        await Criteria.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_DELETE,
                Constants.TypeNames.CRITERIA.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getCriteria,
    getCriteries,
    updateCriteria,
    deleteCriteria,
    addCriteria,
};

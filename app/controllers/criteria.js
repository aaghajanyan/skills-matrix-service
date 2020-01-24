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
const {
    couldNotGetCriteria,
    couldNotAddCriteria,
    couldNotUpdateCriteria,
    couldNotDeleteCriteria,
    alreadyExistsCriteria
 } = require('../helper/errorResponseBodyBuilder');

const getCriteries = async function(_, response) {
    try {
        const criteries = await Criteria.findAll();
        return response.status(OK).json(criteries);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            couldNotGetCriteria(Constants.TypeNames.CRITERIAS.toLowerCase())
        );
    }
};

const getCriteria = async function(request, response) {
    try {
        const criteria = await Criteria.find({ guid: request.params.guid });
        response.status(OK).json(criteria);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            couldNotGetCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.params.guid)
        );
    }
};

const addCriteria = async function(request, response) {
    try {
        const { criteria, isNewRecord } = await Criteria.findOrCreate({
            name: request.body.name,
            type: request.body.type,
        });
        if (!isNewRecord) {
            return response.status(OK).json(
                alreadyExistsCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.body.name)
            );
        }
        return response.status(CREATED).json({
            criteria,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            couldNotAddCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.body.name)
        );
    }
};

const updateCriteria = async function(request, response) {
    try {
        await Criteria.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            couldNotUpdateCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.params.guid)
        );
    }
};

const deleteCriteria = async function(request, response) {
    try {
        await Criteria.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            couldNotDeleteCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.params.guid)
        );
    }
};

module.exports = {
    getCriteria,
    getCriteries,
    updateCriteria,
    deleteCriteria,
    addCriteria,
};

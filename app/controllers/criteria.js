const {OK, INTERNAL_SERVER_ERROR, ACCEPTED, CREATED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Criteria = require('../models/criteria');
const logger = require('../helper/logger');

module.exports.getCriteries = async (_, response) => {
    try {
        const criteries = await Criteria.findAll();
        return response.status(OK).json(criteries);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.CRITERIAS.toLowerCase()));
    }
};

module.exports.getCriteria = async (request, response) => {
    try {
        const criteria = await Criteria.find({ guid: request.params.guid });
        response.status(OK).json(criteria);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.params.guid));
    }
};

module.exports.addCriteria = async (request, response) => {
    try {
        const { criteria, isNewRecord } = await Criteria.findOrCreate({
            name: request.body.name,
            type: request.body.type,
        });
        if (!isNewRecord) {
            return response.status(OK).json(responseBuilder.alreadyExistsCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.body.name));
        }
        return response.status(CREATED).json({
            criteria,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotAddCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.body.name));
    }
};

module.exports.updateCriteria = async (request, response) => {
    try {
        await Criteria.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.params.guid));
    }
};

module.exports.deleteCriteria = async (request, response) => {
    try {
        await Criteria.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.CRITERIA.toLowerCase(), request.params.guid));
    }
};

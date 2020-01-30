const {OK, INTERNAL_SERVER_ERROR, ACCEPTED, CREATED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Position = require('../models/position');
const logger = require('../helper/logger');

module.exports.getPositions = async (_, response) => {
    try {
        const positions = await Position.findAll();
        return response.status(OK).json(positions);
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.POSITIONS.toLowerCase()));
    }
};

module.exports.getPosition = async (request, response) => {
    try {
        const position = await Position.find({guid: request.params.guid});
        response.status(OK).json(position);
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.params.guid));
    }
};

module.exports.addPosition = async (request, response) => {
    try {
        const {position, isNewRecord} = await Position.findOrCreate({
            name: request.body.name
        });
        if(!isNewRecord) {
            return response.status(OK).json(responseBuilder.alreadyExistsCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.body.name));
        }
        return response.status(CREATED).json({position});
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotAddCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.body.name));
    }
};

module.exports.updatePosition = async (request, response) => {
    try {
        await Position.update(request.body, {guid: request.params.guid});
        response.status(ACCEPTED).json({success: true});
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.params.guid));
    }
};

module.exports.deletePosition = async (request, response) => {
    try {
        await Position.delete({guid: request.params.guid});
        return response.status(ACCEPTED).json({success: true});
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.params.guid));
    }
};

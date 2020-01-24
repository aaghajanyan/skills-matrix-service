const { OK, INTERNAL_SERVER_ERROR, ACCEPTED, CREATED } = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const Position = require('../models/position');
const { couldNotGetCriteria, couldNotAddCriteria, couldNotUpdateCriteria, couldNotDeleteCriteria } = require('../helper/errorResponseBodyBuilder');

const getPositions = async function(_, response) {
    try {
        const positions = await Position.findAll();
        return response.status(OK).json(positions);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.POSITIONS.toLowerCase()));
    }
};

const getPosition = async function(request, response) {
    try {
        const position = await Position.find({ guid: request.params.guid });
        response.status(OK).json(position);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.params.guid));
    }
};

const addPosition = async function(request, response) {
    try {
        const { position, isNewRecord } = await Position.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response.status(OK).json(alreadyExistsCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.body.name));
        }
        return response.status(CREATED).json({ position });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotAddCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.body.name));
    }
};

const updatePosition = async function(request, response) {
    try {
        await Position.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotUpdateCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.params.guid));
    }
};

const deletePosition = async function(request, response) {
    try {
        await Position.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotDeleteCriteria(Constants.TypeNames.POSITION.toLowerCase(), request.params.guid));
    }
};

module.exports = {
    getPosition,
    getPositions,
    updatePosition,
    deletePosition,
    addPosition,
};

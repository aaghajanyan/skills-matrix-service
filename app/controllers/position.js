const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const Position = require('../models/position');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getPositions = async function(_, response) {
    try {
        const positions = await Position.findAll();
        return response.status(OK).json(positions);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.POSITION.toLowerCase()
            )}`,
        });
    }
};

const getPosition = async function(request, response) {
    try {
        const position = await Position.find({ guid: request.params.guid });
        response.status(OK).json(position);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.POSITION.toLowerCase()
            )}`,
        });
    }
};

const addPosition = async function(request, response) {
    try {
        const { position, isNewRecord } = await Position.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                    Constants.Controllers.TypeNames.POSITION.toLowerCase()
                )}`,
            });
        }
        return response.status(CREATED).json({
            position,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.POSITION.toLowerCase()
            )}`,
        });
    }
};

const updatePosition = async function(request, response) {
    try {
        await Position.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.POSITION.toLowerCase()
            )}`,
        });
    }
};

const deletePosition = async function(request, response) {
    try {
        await Position.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.POSITION.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getPosition,
    getPositions,
    updatePosition,
    deletePosition,
    addPosition,
};

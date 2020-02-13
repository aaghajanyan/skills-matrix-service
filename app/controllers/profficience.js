const {OK, INTERNAL_SERVER_ERROR, ACCEPTED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Profficience = require('../models/profficience');
const logger = require('../helper/logger');

module.exports.getProfficience = async (_, response) => {
    try {
        const profficience = await Profficience.findAll();
        return response.status(OK).json(profficience);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.PROFFICIENCE.toLowerCase()));
    }
};

module.exports.updateProfficience = async (request, response) => {
    try {
        await Profficience.update({...request.body, id: request.params.id}, request.params.id );
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.PROFFICIENCE.toLowerCase(), request.params.id));
    }
};

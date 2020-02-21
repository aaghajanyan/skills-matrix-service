const {OK, INTERNAL_SERVER_ERROR, ACCEPTED, CREATED} = require('http-status-codes');
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
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetProfficience(Constants.TypeNames.PROFFICIENCE.toLowerCase()));
    }
};

module.exports.updateProfficience = async (request, response) => {
    try {
        await Profficience.update({...request.body, id: request.params.id}, request.params.id );
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateProfficience(Constants.TypeNames.PROFFICIENCE.toLowerCase(), request.params.id));
    }
};

module.exports.addProfficience = async (request, response) => {
    try {
        const { profficience, isNewRecord } = await Profficience.findOrCreate({
            name: request.body.name,
            value: request.body.value,
        });

        if (isNewRecord) {
            return response.status(CREATED).json({
                profficience,
            });
        }
        return response.status(OK).json(responseBuilder.alreadyExistsCriteria(Constants.TypeNames.PROFFICIENCE.toLowerCase(), request.body.id));

    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotAddProfficience(Constants.TypeNames.PROFFICIENCE.toLowerCase(), request.body.id));
    }
};

module.exports.deleteProfficience = async (request, response) => {
    try {
        await Profficience.delete({ id: request.params.id });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.PROFFICIENCE.toLowerCase(), request.params.id));
    }
}

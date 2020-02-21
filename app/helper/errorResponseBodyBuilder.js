const util = require('util');
const {Constants} = require('../constants/Constants');

module.exports.couldNotGetCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_GET1, criteriaType, value);
};

module.exports.couldNotAddCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_ADD1, criteriaType, value);
};

module.exports.couldNotUpdateCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_UPDATE1, criteriaType, value);
};

module.exports.couldNotDeleteCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_DELETE1, criteriaType, value);
};

module.exports.alreadyExistsCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.ALREADY_EXISTS1, value, criteriaType);
};

module.exports.doesNotExistCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.DOES_NOT_EXSTS1, criteriaType, value);
};

module.exports.addErrorMsg = msg => {
    return criteria(msg, '', '');
};

module.exports.internalServerError = (criteriaType, value = '') => {
    return criteria('', criteriaType, value);
};

const criteria = (errorTypeMsg, criteriaType, value = '') => {
    return {
        success: false,
        message: `${util.format(errorTypeMsg, criteriaType, value)}`,
    };
};

module.exports.couldNotGetProfficience = (profficienceType, value = '') => {
    return profficience(Constants.ErrorMessages.COULD_NOT_GET1, profficienceType, value);
};

module.exports.couldNotAddProfficience = (profficienceType, value = '') => {
    return profficience(Constants.ErrorMessages.COULD_NOT_ADD1, profficienceType, value);
};

module.exports.couldNotUpdateProfficience = (profficienceType, value = '') => {
    return profficience(Constants.ErrorMessages.COULD_NOT_UPDATE1, profficienceType, value);
};

module.exports.alreadyExistsProfficience = (profficienceType, value = '') => {
    return profficience(Constants.ErrorMessages.ALREADY_EXISTS1, value, profficienceType);
};

const profficience = (errorTypeMsg, profficienceType, value = '') => {
    return {
        success: false,
        message: `${util.format(errorTypeMsg, profficienceType, value)}`,
    };
};
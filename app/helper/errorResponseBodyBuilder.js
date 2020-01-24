const { Constants } = require('../constants/Constants');
const ErrorMessageParser = require('../errors/ErrorMessageParser');
const {
    UNAUTHORIZED,
    getStatusText
} = require('http-status-codes');

module.exports.couldNotGetCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_GET1, criteriaType, value);
}

module.exports.couldNotAddCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_ADD1, criteriaType, value);
}

module.exports.couldNotUpdateCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_UPDATE1, criteriaType, value);
}

module.exports.couldNotDeleteCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.COULD_NOT_DELETE1, criteriaType, value);
}

module.exports.alreadyExistsCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.ALREADY_EXISTS1, criteriaType, value);
}

module.exports.doesNotExistCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.DOES_NOT_EXSTS1, criteriaType, value);
}

module.exports.unautorized = (criteriaType, value = '') => {
    return criteria('%1', criteriaType, value);
}

module.exports.internalServerError = (criteriaType, value = '') => {
    return criteria('%1', criteriaType, value);
}

module.exports.badRequest = (criteriaType, value = '') => {
    return criteria('%1', criteriaType, value);
}

module.exports.conflictError = (criteriaType, value = '') => {
    return criteria('%1', criteriaType, value);
}

module.exports.couldNotRegisterUser = (criteriaType, value = '') => {
    return criteria('%1', criteriaType, value);
}

const criteria = (errorType, criteriaType, value = '') => {
    return {
        success: false,
        message: `${ErrorMessageParser.stringFormatter(
            errorType,
            criteriaType, value
        )}`,
    }
};

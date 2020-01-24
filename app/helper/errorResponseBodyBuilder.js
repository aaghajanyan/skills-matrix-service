const { Constants } = require('../constants/Constants');
const util = require('util');

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
    return criteria(Constants.ErrorMessages.ALREADY_EXISTS1, value, criteriaType);
}

module.exports.doesNotExistCriteria = (criteriaType, value = '') => {
    return criteria(Constants.ErrorMessages.DOES_NOT_EXSTS1, criteriaType, value);
}

module.exports.addErrorMsg = (msg) => {
    return criteria(msg, '', '');
}

module.exports.internalServerError = (criteriaType, value = '') => {
    return criteria('', criteriaType, value);
}

const criteria = (errorTypeMsg, criteriaType, value = '') => {
    return {
        success: false,
        message: `${util.format(errorTypeMsg, criteriaType, value)}`
    }
};

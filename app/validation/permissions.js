const jwt = require('jsonwebtoken');
const loginSecretKey = require('../../config/env-settings.json').loginSecretKey;
const jwtDecode = require('jwt-decode');
const User = require('../models/user');
const logger = require('../helper/logger');
const { Constants } = require('../constants/Constants');
const { FORBIDDEN, UNAUTHORIZED, getStatusText } = require('http-status-codes');
const { addErrorMsg } = require('../helper/errorResponseBodyBuilder');

module.exports.verifyPermissions = async (request, response, next) => {
    try {
        const token = request.header(Constants.AUTHORIZATION).split(Constants.BEARER)[1];
        if (!token) {
            return response.status(FORBIDDEN).send(addErrorMsg(getStatusText(FORBIDDEN)));
        }
        const verified = await jwt.verify(token, loginSecretKey);
        const decodedToken = await jwtDecode(token, loginSecretKey);
        const currUser = await User.getByGuid(decodedToken.guid);
        if (currUser.roleGroup.name !== Constants.Roles.SUPER_USER) {
            return response.status(FORBIDDEN).send(addErrorMsg(getStatusText(FORBIDDEN)));
        }
        request.user = verified;
        next();
    } catch (error) {
        logger.error(error);
        return response.status(UNAUTHORIZED).send(addErrorMsg(getStatusText(UNAUTHORIZED)));
    }
};

const jwt = require('jsonwebtoken');
const tokenSecret = require('../../config/env-settings.json').secretKey;
const jwtDecode = require('jwt-decode');
const User = require('../models/user');
const logger = require('../helper/logger');
const { Constants } = require('../constants/Constants');
const { FORBIDDEN, UNAUTHORIZED } = require('http-status-codes');

const verifyPermissions = async (request, response, next) => {
    try {
        const token = request.header(Constants.AUTHORIZATION).split(Constants.BEARER)[1];
        if (!token) {
            return response.status(403).send(Constants.Permissions.ACCESS_DENIED);
        }
        const verified = await jwt.verify(token, tokenSecret);
        const decodedToken = await jwtDecode(token, tokenSecret);
        const currUser = await User.getByGuid(decodedToken.guid).then(user => {
            return user;
        });
        if (currUser.roleGroup.name !== Constants.Roles.SUPER_USER) {
            return response.status(FORBIDDEN).send({
                success: false,
                message: Constants.Permissions.ACCESS_DENIED,
            });
        }
        request.user = verified;
        next();
    } catch (error) {
        logger.error(error);
        return response.status(UNAUTHORIZED).send({
            success: false,
            message: Constants.Permissions.UNAUTHORIZED,
        });
    }
};

module.exports = { verifyPermissions };

const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const {UNAUTHORIZED, FORBIDDEN, getStatusText} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const loginSecretKey = require('../../config/env-settings.json').loginSecretKey;
const invitationSecretToken = require('../../config/env-settings.json').invitationSecretKey;
const forgotPasswordTokenSecret = require('../../config/env-settings.json').forgotPasswordSecretKey;

const verifyToken = async (request, response, next, token, secret) => {
    try {
        if(!token) {
            return response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
        }
        const verified = await jwt.verify(token, secret);
        request.user = verified;
        const decodedToken = await jwtDecode(token, loginSecretKey);
        request.guid = decodedToken.guid;
        next();
    } catch(err) {
        response.status(UNAUTHORIZED).send();
    }
};

module.exports.verifyLoginToken = (request, response, next) => {
    try {
        const token = request.header(Constants.AUTHORIZATION).split(Constants.BEARER)[1];
        verifyToken(request, response, next, token, loginSecretKey);
    } catch(err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

module.exports.verifyRightPermission = (request, response, next) => {
    try {
        if(request.guid !== request.params.userGuid) {
            return response.status(FORBIDDEN).send(getStatusText(FORBIDDEN));
        }
        next();
    } catch(err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

module.exports.verifyRegisterToken = (request, response, next) => {
    try {
        const token = request.params.token;
        verifyToken(request, response, next, token, invitationSecretToken);
    } catch(err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

module.exports.verifyForgotPasswordToken = (request, response, next) => {
    try {
        const token = request.params.token;
        verifyToken(request, response, next, token, forgotPasswordTokenSecret);
    } catch(err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

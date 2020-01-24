const jwt = require('jsonwebtoken');
const loginSecretKey = require('../../config/env-settings.json').loginSecretKey;
const invitationSecretToken = require('../../config/env-settings.json').invitationSecretKey;
const forgotPasswordTokenSecret = require('../../config/env-settings.json').forgotPasswordSecretKey;
const { UNAUTHORIZED, getStatusText } = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const jwtDecode = require('jwt-decode');
const { OK, INTERNAL_SERVER_ERROR, CONFLICT, FORBIDDEN } = require('http-status-codes');

const verifyToken = async (request, response, next, token, secret) => {
    try {
        if (!token) {
            return response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
        }
        const verified = await jwt.verify(token, secret);
        request.user = verified;
        const decodedToken = await jwtDecode(token, loginSecretKey);
        request.guid = decodedToken.guid;
        console.log('111 request = ', request.guid);

        next();
    } catch (err) {
        response.status(UNAUTHORIZED).send();
    }
};

const verifyLoginToken = async (request, response, next) => {
    try {
        const token = request.header(Constants.AUTHORIZATION).split(Constants.BEARER)[1];
        verifyToken(request, response, next, token, loginSecretKey);
    } catch (err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

const verifyRightPermission = async (request, response, next) => {
    try {
        if (request.guid !== request.params.userGuid) {
            return response.status(FORBIDDEN).send(getStatusText(FORBIDDEN));
        }
        next();
    } catch (err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

const verifyRegisterToken = async (request, response, next) => {
    try {
        const token = request.params.token;
        verifyToken(request, response, next, token, invitationSecretToken);
    } catch (err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

const verifyForgotPasswordToken = async (request, response, next) => {
    try {
        const token = request.params.token;
        verifyToken(request, response, next, token, forgotPasswordTokenSecret);
    } catch (err) {
        response.status(UNAUTHORIZED).send(getStatusText(UNAUTHORIZED));
    }
};

module.exports = {
    verifyLoginToken,
    verifyRegisterToken,
    verifyForgotPasswordToken,
    verifyRightPermission,
};

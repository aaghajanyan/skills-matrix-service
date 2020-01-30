const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const util = require('util');
const {OK, INTERNAL_SERVER_ERROR, CONFLICT, ACCEPTED, UNAUTHORIZED, getStatusText} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const User = require('../models/user');
const mailer = require('../email/email');
const client = require('../../config/env-settings.json').client;
const forgotPasswordTokenSecret = require('../../config/env-settings.json').forgotPasswordSecretKey;
const logger = require('../helper/logger');

module.exports.checkForgotPasswordUser = async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        const user = await User.findOne({guid: decodedToken.guid});
        if(!user) {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.USER, decodedToken.guid));
        }
        return response.status(OK).json({
            success: true,
            token: token
        });
    } catch(error) {
        logger.error(error);
        return response.status(UNAUTHORIZED).json(responseBuilder.addErrorMsg(getStatusText(UNAUTHORIZED)));
    }
};

module.exports.forgotPassword = async (request, response) => {
    try {
        const user = await User.findOne({email: request.body.email});
        if(!user) {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.USER, request.body.email));
        }
        const token = jwt.sign(
            {
                guid: user.guid,
                created_date: Date().now
            },
            forgotPasswordTokenSecret,
            {expiresIn: Constants.FORGOT_PASSWORD_TOKEN_EXPiRE_DATE}
        );
        try {
            const expiration = new Date().setDate(new Date().getDate() + 1);
            const host = `${client.protocol}${client.host}:${client.port}${Constants.FORGOT_PASSWORD_ENDPOINT}${token}`;
            await mailer.resetPassword(request.body.email, host, expiration);
        } catch(error) {
            logger.error(error);
            return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.internalServerError(Constants.Controllers.ForgotPassword.COULD_NOT_SEND_EMAIL));
        }
        return response.status(OK).json({
            success: true,
            message: `${util.format(Constants.Controllers.ForgotPassword.SENDED_MAIL_ADDRESS, request.body.email)}`,
            token: token
        });
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.internalServerError(getStatusText(INTERNAL_SERVER_ERROR)));
    }
};

module.exports.changePassword = async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        await User.update(decodedToken.guid, request.body);
        return response.status(ACCEPTED).json({success: true});
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.internalServerError(Constants.Controllers.ForgotPassword.COULD_NOT_CHANGE_PASSWORD));
    }
};

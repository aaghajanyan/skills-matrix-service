const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    UNAUTHORIZED,
    getStatusText,
} = require('http-status-codes');
const User = require('../models/user');
const forgotPasswordTokenSecret = require('../../config/env-settings.json')
    .forgotPasswordSecretKey;
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const mailer = require('../email/email');
const client = require('../../config/env-settings.json').client;
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');
const {
    doesNotExistCriteria,
    unautorized,
    internalServerError
 } = require('../helper/errorResponseBodyBuilder');

const checkForgotPasswordUser = async function(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        const user = await User.findOne({ guid: decodedToken.guid });
        if (!user) {
            return response.status(CONFLICT).json(
                doesNotExistCriteria(Constants.TypeNames.USER, decodedToken.guid)
            );
        }
        return response.status(OK).json({
            success: true,
            token: token,
        });
    } catch (error) {
        logger.error(error);
        return response.status(UNAUTHORIZED).json(
            unautorized(getStatusText(UNAUTHORIZED))
        );
    }
};

const forgotPassword = async function(request, response) {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (!user) {
            return response.status(CONFLICT).json(
                doesNotExistCriteria(Constants.TypeNames.USER, request.body.email)
            );
        }
        const token = jwt.sign(
            {
                guid: user.guid,
                created_date: Date().now,
            },
            forgotPasswordTokenSecret,
            { expiresIn: Constants.FORGOT_PASSWORD_TOKEN_EXPiRE_DATE }
        );
        try {
            const expiration = new Date().setDate(new Date().getDate() + 1);
            const host = `${client.protocol}${client.host}:${client.port}${Constants.FORGOT_PASSWORD_ENDPOINT}${token}`;
            await mailer.resetPassword(request.body.email, host, expiration);
        } catch (error) {
            logger.error(error);
            return response.status(INTERNAL_SERVER_ERROR).json(
                internalServerError(Constants.Controllers.ForgotPassword.COULD_NOT_SEND_EMAIL)
            );
        }
        return response.status(OK).json({
            success: true,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ForgotPassword.SENDED_MAIL_ADDRESS,
                request.body.email
            )}`,
            token: token,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            internalServerError(getStatusText(INTERNAL_SERVER_ERROR))
        );
    }
};

async function changePassword(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        await User.update(decodedToken.guid, request.body);
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            internalServerError(Constants.Controllers.ForgotPassword.COULD_NOT_CHANGE_PASSWORD)
        );
    }
}

module.exports = {
    forgotPassword,
    checkForgotPasswordUser,
    changePassword,
};

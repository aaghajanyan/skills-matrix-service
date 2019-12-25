const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    UNAUTHORIZED,
    getStatusText
} = require("http-status-codes");
const User = require("../models/user");
const forgotPasswordTokenSecret = require("../../config/forgotPasswordSecretKey.json")
    .token_secret;
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const mailer = require("../mailSender/mailSender");
const client = require("../../config/env-settings.json").client;
const { Constants } = require("../constants/Constants");

const checkForgotPasswordUser = async function(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        const user = await User.findOneUser({ guid: decodedToken.guid });
        if (!user) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`
            });
        }
        return response.status(OK).json({
            success: true,
            token: token
        });
    } catch (err) {
        return response.status(UNAUTHORIZED).json({
            success: false,
            message: getStatusText(UNAUTHORIZED)
        });
    }
};

const forgotPassword = async function(request, response) {
    try {
        const user = await User.findOneUser({ email: request.body.email });
        if (!user) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`
            });
        }
        const token = jwt.sign(
            {
                guid: user.guid,
                createdDate: Date().now
            },
            forgotPasswordTokenSecret,
            { expiresIn: Constants.FORGOT_PASSWORD_TOKEN_EXPiRE_DATE }
        );
        try {
            const expiration = new Date().setDate(new Date().getDate() + 1);
            const host = `${client.protocol}${client.host}:${client.port}${Constants.FORGOT_PASSWORD_ENDPOINT}${token}`;
            await mailer.resetPassword(request.body.email, host, expiration);
        } catch (err) {
            return response.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: `${getStatusText(INTERNAL_SERVER_ERROR)}. ${
                    Constants.Controllers.ForgotPassword.COULD_NOT_SEND_EMAIL
                }`
            });
        }
        return response.status(OK).json({
            success: true,
            message: `${Constants.parse(
                Constants.Controllers.ForgotPassword.SENDED_MAIL_ADDRESS,
                request.body.email
            )}`,
            token: token
        });
    } catch (error) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: getStatusText(INTERNAL_SERVER_ERROR)
        });
    }
};

async function changePassword(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        await User.update(decodedToken.guid, request.body);
        return response.status(ACCEPTED).json({ success: true });
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(INTERNAL_SERVER_ERROR)}. ${
                Constants.Controllers.ForgotPassword.COULD_NOT_CHANGE_PASSWORD
            }`
        });
    }
}

module.exports = {
    forgotPassword,
    checkForgotPasswordUser,
    changePassword
};

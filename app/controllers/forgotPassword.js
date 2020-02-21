const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const util = require('util');
const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    UNAUTHORIZED,
    getStatusText,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const User = require('../models/user');
const mailer = require('../email/email');
const client = require('../../config/env-settings.json').client;
const forgotPasswordTokenSecret = require('../../config/env-settings.json')
    .forgotPasswordSecretKey;
const logger = require('../helper/logger');

/**
 * @swagger
 * /forgot_password/change/{token}:
 *  get:
 *      summary: Check forgot password token
 *      tags: [Forgot password]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: token
 *            description: Token to check for forgot password
 *            required: true
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not check forgot password.
 */
module.exports.checkForgotPasswordUser = async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        const user = await User.findOne({ guid: decodedToken.guid });
        if (!user) {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        decodedToken.guid
                    )
                );
        }
        return response.status(OK).json({
            success: true,
            token: token,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(UNAUTHORIZED)
            .json(responseBuilder.addErrorMsg(getStatusText(UNAUTHORIZED)));
    }
};

/**
 * @swagger
 * /forgot_password:
 *   post:
 *     summary: Send token to an email to change password
 *     tags: [Forgot password]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Email to send forgot password token for password reset
 *         schema:
 *           $ref: '#/definitions/forgotPassword'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not send token.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.forgotPassword = async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (!user) {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.body.email
                    )
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
            return response
                .status(INTERNAL_SERVER_ERROR)
                .json(
                    responseBuilder.internalServerError(
                        Constants.Controllers.ForgotPassword
                            .COULD_NOT_SEND_EMAIL
                    )
                );
        }
        return response.status(OK).json({
            success: true,
            message: `${util.format(
                Constants.Controllers.ForgotPassword.SENDED_MAIL_ADDRESS,
                request.body.email
            )}`,
            token: token,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.internalServerError(
                    getStatusText(INTERNAL_SERVER_ERROR)
                )
            );
    }
};

/**
 * @swagger
 * /forgot_password/change/{token}:
 *   post:
 *     summary: Change password
 *     tags: [Forgot password]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *       - in: body
 *         name: body
 *         description: Change password
 *         schema:
 *           $ref: '#/definitions/forgotPasswordChange'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not change password.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.changePassword = async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, forgotPasswordTokenSecret);
        await User.update(decodedToken.guid, request.body);
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.internalServerError(
                    Constants.Controllers.ForgotPassword
                        .COULD_NOT_CHANGE_PASSWORD
                )
            );
    }
};

const {
    OK,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND,
    CONFLICT,
    NO_CONTENT,
    UNAUTHORIZED,
    getStatusText,
} = require('http-status-codes');
const jwtDecode = require('jwt-decode');
const invitationSecretToken = require('../../config/env-settings.json')
    .invitationSecretKey;
const jwt = require('jsonwebtoken');
const mailer = require('../email/email');
const client = require('../../config/env-settings.json').client;
const { Constants } = require('../constants/Constants');
const Invitation = require('../models/invitation');
const User = require('../models/user');
const logger = require('../helper/logger');
const {
    couldNotAddCriteria,
    internalServerError,
    conflictError
 } = require('../helper/errorResponseBodyBuilder');

const checkInvitationInDB = async function(request, response) {
    try {
        const token = await request.params.token;
        const decodedToken = await jwtDecode(token, invitationSecretToken);
        const invitation = await Invitation.findByPk(decodedToken.guid);
        if (invitation) {
            return response.status(NOT_FOUND).send();
        }
        return response.status(NO_CONTENT).send();
    } catch (error) {
        logger.error(error);
        return response.status(UNAUTHORIZED).send();
    }
};

const addInvitation = async function(request, response) {
    try {
        const invitation = await Invitation.find({ email: request.body.email });
        if (!invitation) {
            const user = await User.findOne({ email: request.body.email });
            if (!user) {
                const currInvitation = await Invitation.create(request.body);
                const token = jwt.sign(
                    {
                        guid: currInvitation.id,
                        created_date: Date().now,
                    },
                    invitationSecretToken,
                    { expiresIn: Constants.INVITATION_TOKEN_EXPiRE_DATE }
                );
                try {
                    const expiration = new Date().setDate(
                        new Date().getDate() + 7
                    );
                    const host = `${client.protocol}${client.host}:${client.port}${Constants.REGISTRATION_ENDPOINT}${token}`;
                    await mailer.invite(request.body.email, host, expiration);
                } catch (error) {
                    logger.error(error);
                    currInvitation.destroy();
                    return response.status(INTERNAL_SERVER_ERROR).json(
                        internalServerError(Constants.Controllers.Invitation.COULD_NOT_SEND_EMAIL)
                    );
                }
                return response.status(OK).json({
                    success: true,
                    [Constants.TOKEN]: token,
                    guid: currInvitation.id,
                });
            } else {
                return response.status(CONFLICT).json(
                    conflictError(Constants.Controllers.Invitation.EMAIL_ALREADY_EXISTS_USER_MODEL)
                );
            }
        } else {
            return response.status(CONFLICT).json(
                conflictError(Constants.Controllers.Invitation.EMAIL_ALREADY_EXISTS_INVITATION_MODEL)
            );
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            couldNotAddCriteria(Constants.TypeNames.INVITATION.toLowerCase())
        );
    }
};

module.exports = {
    addInvitation,
    checkInvitationInDB,
};

const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const {OK, INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT, NO_CONTENT, UNAUTHORIZED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const invitationSecretToken = require('../../config/env-settings.json').invitationSecretKey;
const mailer = require('../email/email');
const client = require('../../config/env-settings.json').client;
const Invitation = require('../models/invitation');
const User = require('../models/user');
const logger = require('../helper/logger');

module.exports.checkInvitationInDB = async (request, response) => {
    try {
        const token = await request.params.token;
        const decodedToken = await jwtDecode(token, invitationSecretToken);
        const invitation = await Invitation.findByPk(decodedToken.guid);
        if (!invitation) {
            return response.status(NOT_FOUND).send();
        }
        return response.status(NO_CONTENT).send();
    } catch (error) {
        logger.error(error);
        return response.status(UNAUTHORIZED).send();
    }
};

module.exports.addInvitation = async (request, response) => {
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
                    const expiration = new Date().setDate(new Date().getDate() + 7);
                    const host = `${client.protocol}${client.host}:${client.port}${Constants.REGISTRATION_ENDPOINT}${token}`;
                    await mailer.invite(request.body.email, host, expiration);
                } catch (error) {
                    logger.error(error);
                    currInvitation.destroy();
                    return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.internalServerError(Constants.Controllers.Invitation.COULD_NOT_SEND_EMAIL));
                }
                return response.status(OK).json({
                    success: true,
                    [Constants.TOKEN]: token,
                    guid: currInvitation.id,
                });
            } else {
                return response.status(CONFLICT).json(responseBuilder.addErrorMsg(Constants.Controllers.Invitation.EMAIL_ALREADY_EXISTS_USER_MODEL));
            }
        } else {
            return response.status(CONFLICT).json(responseBuilder.addErrorMsg(Constants.Controllers.Invitation.EMAIL_ALREADY_EXISTS_INVITATION_MODEL));
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotAddCriteria(Constants.TypeNames.INVITATION.toLowerCase()));
    }
};

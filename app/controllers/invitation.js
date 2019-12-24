const { OK,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    NOT_FOUND,
    CONFLICT,
    NO_CONTENT,
    UNAUTHORIZED,
    getStatusText } = require('http-status-codes');
const {
    invitation: invitationModel,
    user: userModel
} = require("../sequelize/models");
const jwtDecode = require('jwt-decode');
const tokenSecret = require('../../config/invitationSecretKey.json').token_secret;
const jwt = require('jsonwebtoken');
const mailer = require('../mailSender/mailSender');
const client = require('../../config/env-settings.json').client;
const { Constants } = require('../constants/Constants');


const checkInvitationInDB = async function(request, response) {
    try {
        const token = await request.params.token;
        const decodedToken = await jwtDecode(token, tokenSecret);
        const invitation = await invitationModel.findOne({
            where: { id: decodedToken.guid }
        });
        if (!invitation) {
            return response.status(NOT_FOUND).json({
                success: false,
                message: getStatusText(NOT_FOUND)
            });
        }
        return response.status(NO_CONTENT).send();
    } catch (err) {
        return response.status(UNAUTHORIZED).json({
            success: false,
            message: getStatusText(UNAUTHORIZED)
        });
    }
};

const addInvitation = async function(request, response) {
    try {
        const invitation = await invitationModel.findOne({
            where: { email: request.body.email }
        });
        if (!invitation) {
            const user = await userModel.findOne({
                where: { email: request.body.email }
            });
            if (!user) {
                const currInvitation = await invitationModel.create(request.body);
                const token = jwt.sign(
                    {
                        guid: currInvitation.id,
                        createdDate: Date().now
                    },
                    tokenSecret,
                    { expiresIn: Constants.INVITATION_TOKEN_EXPiRE_DATE }
                );
                try {
                    const expiration = new Date().setDate(new Date().getDate()+7);
                    const host = `${client.protocol}${client.host}:${client.port}${Constants.REGISTRATION_ENDPOINT}${token}`;
                    await mailer.invite(request.body.email, host, expiration);
                } catch(err) {
                    currInvitation.destroy();
                    return response.status(BAD_REQUEST).json({
                        success: false,
                        message: getStatusText(BAD_REQUEST)
                    });
                };
                return response.status(OK).json({
                    success: true,
                    [Constants.TOKEN]: token,
                    guid: currInvitation.id
                });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: Constants.Controllers.Invitation.EMAIL_ALREADY_EXISTS_USER_MODEL
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: Constants.Controllers.Invitation.EMAIL_ALREADY_EXISTS_INVITATION_MODEL
            });
        }
    } catch(error) {
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${Constants.Controllers.Invitation.COULD_NOT_ADD_INVITATION} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
}

module.exports = {
    addInvitation,
    checkInvitationInDB
};

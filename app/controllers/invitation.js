const {
    invitation: invitationModel,
    user: userModel
} = require("../sequelize/models");
var jwt_decode = require('jwt-decode');

const tokenSecret = require('../../config/invitationSecretKey.json').token_secret;
const jwt = require('jsonwebtoken');
const mailer = require('../mailSender/mailSender');
const client = require('../../config/env-settings.json').client;

const checkInvitationInDB = async function(request, response) {
    try {
        const token = await request.header("auth-token");
        const decodedToken = await jwt_decode(token, tokenSecret);
        const invitation = await invitationModel.findOne({
            where: { id: decodedToken.guid }
        });
        if (!invitation) {
            return response.status(404).json({
                success: false,
                message: Messages.get("Users.errors.invitation")
            });
        }
        return response.status(204).send();
    } catch (err) {
        return response.status(401).json({
            success: false,
            message: "Unauthorized.Access denied."
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
                    { expiresIn: '30 m' }
                );
                try {
                    const expiration = Date.now().valueOf() + ('30 m' * 1000);
                    const host = `${client.host}:${client.port}/registration`;
                    await mailer.invite(request.body.email, request.body.invitedByUser, host, token, expiration);
                } catch(err) {
                    currInvitation.destroy();
                    return response.status(400).send({
                        success: false,
                        message: 'Could not send email'
                    });
                };
                return response.status(200).json({
                    success: true,
                    'token': token,
                    guid: currInvitation.id
                });
            } else {
                return response.status(409).json({
                    success: false,
                    message: 'Email already exists in users'
                });
            }
        } else {
            return esponse.status(409).json({
                success: false,
                message: 'Email already exists in invitations'
            });
        }
    } catch(error) {
        return response.status(409).send(error);
    }
}

module.exports = {
    addInvitation,
    checkInvitationInDB
};

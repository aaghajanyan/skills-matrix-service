const {
    user: userModel
} = require("../sequelize/models");
const User = require("../models/user");
const forgotPasswordTokenSecret = require('../../config/forgotPasswordSecretKey.json').token_secret;

const jwt = require('jsonwebtoken');
const MailSender = require('../mailSender/mailSender');
const  Messages = require('../constants/Messages');
const jwt_decode = require('jwt-decode');
const mailer = require('../mailSender/mailSender');

const checkForgotPasswordUser = async function(request, response) {
    try {
        const token = await request.header("auth-token");
        const decodedToken = await jwt_decode(token, forgotPasswordTokenSecret);
        const user = await userModel.findOne({
            where: { guid: decodedToken.guid }
        });
        if (!user) {
            return response.status(404).json({
                success: false,
                message: 'User does not exists'
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

const forgotPassword = async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { email: request.body.email }
        });
        if (!user) {
            return response.status(409).json({
                success: false,
                message: 'User does not exists'
            });
        }
        const token = jwt.sign(
            {
                guid: user.guid,
                createdDate: Date().now
            },
            forgotPasswordTokenSecret,
            { expiresIn: '60 m' }
        );
        try {
            const expiration = new Date().setDate(new Date().getDate()+1);
            const host = `${client.protocol}${client.host}:${client.port}/forgot_password/${token}`;
            await mailer.resetPassword(request.body.email, host, expiration);
        } catch(err) {
            console.log(err)
            return response.status(400).send({
                success: false,
                message: 'Could not send email'
            });
        };
        return response.status(200).send({
            success: true,
            message: `Mail sended in ${request.body.email} email.`
        });
    } catch(error) {
        return response.status(409).send(error);
    }
}

async function changePassword(request, response) {
    try {
        const token = await request.header("auth-token");
        const decodedToken = await jwt_decode(token, forgotPasswordTokenSecret);
        await User.update(decodedToken.guid, request.body);
        return response.status(202).send({success: true});
    } catch(err) {
        return response.status(400).send({
            success: false,
            message: Messages.get('Users.errors.updateUser')
        });
    }}

module.exports = {
    forgotPassword,
    checkForgotPasswordUser,
    changePassword
};

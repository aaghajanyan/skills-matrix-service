const jwt = require('jsonwebtoken');
const tokenSecret = require("../../config/env-settings.json").secretKey;
const invitationSecretToken = require("../../config/env-settings.json").invitationSecretKey;
const forgotPasswordTokenSecret = require("../../config/env-settings.json").forgotPasswordSecretKey;

async function verifyToken(request, response, next, token, secret) {
    try {
        if(!token) {
            return response.status(401).send("Access denied.");
        }
        const verified = await jwt.verify(token, secret);
        request.user = verified;
        next();
    } catch (err) {
        response.status(401).send("Unauthorized.Access denied.");
    }
}

async function verifyLoginToken(request, response, next) {
    try {
        const token = request.header("Authorization").split('Bearer ')[1];
        verifyToken(request, response, next, token, tokenSecret);
    } catch (err) {
        response.status(401).send("Unauthorized.Access denied.");
    }
}

async function verifyRegisterToken(request, response, next) {
    try {
        const token = request.params.token;
        verifyToken(request, response, next, token, invitationSecretToken);
    } catch (err) {
        response.status(401).send("Unauthorized.Access denied.");
    }
}

async function verifyForgotPasswordToken(request, response, next) {
    try {
        const token = request.params.token;
        verifyToken(request, response, next, token, forgotPasswordTokenSecret);
    } catch (err) {
        response.status(401).send("Unauthorized.Access denied.");
    }
}

module.exports = {verifyLoginToken, verifyRegisterToken, verifyForgotPasswordToken};

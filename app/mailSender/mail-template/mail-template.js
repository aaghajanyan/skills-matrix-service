const client = require('../../../config/env-settings.json').client;

const invitationTemplate = (token) => `<h3> The url is active 7 days.</h3><br>
                            <h3>Please register your account for the link bellow:</h3><br>
                            <a href=${client.protocol}${client.host}:${client.port}/registration/${token}>
                                ${client.protocol}${client.host}:${client.port}/registration/${token}
                            </a>`;

const forgotPasswordTemplate = (token) => `<h3> The url is active 1 hour.</h3><br>
                                <h3>Click here to change password:</h3><br>
                                <a href=${client.protocol}${client.host}:${client.port}/forgot_password/${token}>
                                    ${client.protocol}${client.host}:${client.port}/forgot_password/${token}
                                </a>`;

module.exports = {
    invitationTemplate,
    forgotPasswordTemplate
};
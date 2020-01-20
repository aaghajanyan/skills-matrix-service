const nodemailer = require("nodemailer");
const Moment = require('moment');
const path = require('path');
const adminData = require(__dirname + "/../../config/env-settings").nodeMailer;
const EmailTemplates = require('swig-email-templates');
const DATETIME_FORMAT_LONG = 'dddd, MMMM Do YYYY';
const DATE_FORMAT = 'dddd, MMMM Do YYYY';
const logger = require("../helper/logger");


/**
 * Send a user an invite email
 * @param {*} email
 * @param {*} host
 * @param {*} expiration
 */
const invite = (email, host, expiration) => {
    return new Promise((resolve, reject) => {
        try {
            let context = {
                email: email,
                link: host,
                expiration: Moment(expiration).format(DATETIME_FORMAT_LONG),
                invitedBy: 'admin.im@instigatemobile.com',
                date: Moment().format(DATETIME_FORMAT_LONG)
            };
            const resp = sendEmail('invite', context);
            return resolve(resp);
        }
        catch(error) {
            logger.error(error);
            return reject(err);
        }
    }).catch((error) => {
        logger.error(error);
        // TODO add logger
        // log.error(err, 'emails::invite');
    });
};

/**
 * Send a user an invite email
 * @param {*} email
 * @param {*} host
 * @param {*} expiration
 */
const resetPassword = (email, host, expiration) => {
    return new Promise((resolve, reject) => {
        try {
            let context = {
                email: email,
                link: host,
                expiration: Moment(expiration).format(DATETIME_FORMAT_LONG),
                date: Moment().format(DATETIME_FORMAT_LONG)
            };
            const resp = sendEmail('resetPassword', context);
            return resolve(resp);
        }
        catch(err) {
            return reject(err);
        }
    }).catch((err) => {
        // TODO add logger
        // log.error(err, 'emails::invite');
    });
};

/**
 * Craft the email based on the template and email context
 * @param {*} template
 * @param {*} context
 */
const sendEmail = (template, context) => {
    return new Promise((resolve, reject) => {
        try {
            const username = Buffer.from(adminData.username, 'base64').toString('ascii');
            const password = Buffer.from(adminData.password, 'base64').toString('ascii');
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: username,
                  pass: password
                }
              });
            const email = new EmailTemplates();
            //render and send
            email.render(path.join(__dirname, `./templates/${template}.html`), context, (err, html, text, subject) => {
                if(err) {
                    next(err);
                }
                //base options
                const options = {
                    from: adminData.defaultFromAddress,
                    to: context.email,
                    subject,
                    html,
                    text,
                };

                transport.sendMail(options, (err, info) => err ? reject(err) : resolve(info));
            });
        }
        catch(error) {
            logger.error(error, '');
            return reject(err);
        }
    }).catch((error) => {
        logger.error(error, '');
    });
};

module.exports = {
    invite,
    resetPassword
}

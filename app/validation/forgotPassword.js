const Joi = require('joi');
const { BAD_REQUEST } = require('http-status-codes');

const forgotPasswordBodySchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
});

module.exports.validateForgotPasswordBody = (request, response, next) => {
    validateBody(request, response, next, forgotPasswordBodySchema);
};

const validateBody = (request, response, next, schema) => {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(BAD_REQUEST).json(result.error.details);
    }
    next();
};

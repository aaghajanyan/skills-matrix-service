const Joi = require('joi');
const {BAD_REQUEST} = require('http-status-codes');

const addBodySchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
});

module.exports.validateAddBody = (request, response, next) => {
    validateBody(request, response, next, addBodySchema);
};

const validateBody = (request, response, next, schema) => {
    const result = Joi.validate(request.body, schema);
    if(result.error) {
        return response.status(BAD_REQUEST).json(result.error.details);
    }
    next();
};

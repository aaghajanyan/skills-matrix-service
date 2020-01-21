const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required()
});

const validateAddBody = (request, response, next) => {
    validateBody(request, response, next, addBodySchema);
};

const validateBody = (request, response, next, schema) => {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(400).json(result.error.details);
    }
    next();
};

module.exports = {
    validateAddBody
};

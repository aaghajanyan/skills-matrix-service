const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    name: Joi.string()
        .required(),
    type: Joi.string()
        .required()
});
const updateBodySchema = Joi.object().keys({
    name: Joi.string(),
    type: Joi.string()
});

const validateAddBody = (request, response, next) => {
    validateBody(request, response, next, addBodySchema);
};

const validateUpdateBody = (request, response, next) => {
    validateBody(request, response, next, updateBodySchema);
};

const validateBody = (request, response, next, schema) => {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(400).json(result.error.details);
    }
    next();
};

module.exports = {
    validateAddBody,
    validateUpdateBody
};

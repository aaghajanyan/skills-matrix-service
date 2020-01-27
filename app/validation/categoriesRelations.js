const Joi = require('joi');
const { BAD_REQUEST } = require('http-status-codes');

const addBodySchema = Joi.object().keys({
    category_id: Joi.number()
        .integer()
        .required(),
    related_category_id: Joi.number()
        .integer()
        .required(),
});

const updateBodySchema = Joi.object().keys({
    related_category_id: Joi.number()
        .integer()
        .required(),
});

module.exports.validateAddBody = (request, response, next) => {
    validateBody(request, response, next, addBodySchema);
};

module.exports.validateUpdateBody = (request, response, next) => {
    validateBody(request, response, next, updateBodySchema);
};

const validateBody = (request, response, next, schema) => {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(BAD_REQUEST).json(result.error.details);
    }
    next();
};

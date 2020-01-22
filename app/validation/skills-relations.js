const Joi = require('joi');
const { BAD_REQUEST } = require('http-status-codes');

const addBodySchema = Joi.object().keys({
    skill_id: Joi.number()
        .integer()
        .required(),
    category_id: Joi.number()
        .integer()
        .required(),
    uniqueSkillRel: Joi.string(),
});
const updateBodySchema = Joi.object().keys({
    category_id: Joi.number()
        .integer()
        .required(),
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
        return response.status(BAD_REQUEST).json(result.error.details);
    }
    next();
};

module.exports = {
    validateAddBody,
    validateUpdateBody,
};

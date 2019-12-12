const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    userId: Joi.number().integer().required(),
    skillId: Joi.number().integer().required(),
    currentMark: Joi.number().integer.required()
});
const updateBodySchema = Joi.object().keys({
    currentMark: Joi.number().integer.required()
});

const validateAddBody = (request, response, next) => {
    validateBody(request, response, next, addBodySchema);
};

const validateUpdateBody = (request, response, next) => {
    validateBody(request, response, next, updateBodySchema);
};

function validateBody(request, response, next, schema) {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(400).json(result.error.details);
    }
    next();
}

module.exports = {
    validateAddBody,
    validateUpdateBody
};

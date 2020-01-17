const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    skill_id: Joi.number()
        .integer()
        .required(),
    category_id: Joi.number()
        .integer()
        .required(),
    uniqueSkillRel: Joi.string()
});
const updateBodySchema = Joi.object().keys({
    category_id: Joi.number()
        .integer()
        .required()
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

const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    categoryId: Joi.number()
        .integer()
        .required(),
    relatedCategoryId: Joi.number()
        .integer()
        .disallow(Joi.ref("categoryId"))
        .required()
});
const updateBodySchema = Joi.object().keys({
    relatedCategoryId: Joi.number()
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

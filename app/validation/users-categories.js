const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    userGuid: Joi.string()
    .uuid()
    .required(),
    categoryGuid: Joi.string()
        .uuid()
        .required(),
    experience: Joi.number()
        .integer()
        .required(),
    profficience: Joi.number()
        .integer()
        .min(0)
        .max(5),
});

const updateBodySchema = Joi.object().keys({
    userGuid: Joi.string()
        .uuid()
        .required(),
    categoryGuid: Joi.string()
        .uuid()
        .required(),
    experience: Joi.number()
        .integer()
        .required(),
    profficience: Joi.number()
        .integer()
        .min(0)
        .max(5),
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

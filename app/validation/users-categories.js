const Joi = require('joi');
const { BAD_REQUEST } = require('http-status-codes');

const addBodySchema = Joi.object().keys({
    userGuid: Joi.string()
        .uuid()
        .required(),
    categories: Joi.array().items(
        Joi.object()
            .keys({
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
            })
            .required()
    ),
});

const updateBodySchema = Joi.object().keys({
    userGuid: Joi.string()
        .uuid()
        .required(),
    categories: Joi.array().items(
        Joi.object()
            .keys({
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
            })
            .required()
    ),
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

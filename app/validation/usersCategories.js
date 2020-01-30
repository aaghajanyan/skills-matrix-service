const Joi = require('joi');
const {BAD_REQUEST} = require('http-status-codes');

const addBodySchema = Joi.object().keys({
    categories: Joi.array().items(
        Joi.object()
            .keys({
                categoryGuid: Joi.string()
                    .uuid()
                    .required(),
                experience: Joi.number()
                    .integer()
                    .min(0)
                    .max(5)
                    .required(),
                profficience: Joi.number()
                    .integer()
                    .min(0)
                    .max(5)
                    .required(),
                last_worked_date: Joi.date().required()
            })
            .required()
    )
});

const updateBodySchema = Joi.object().keys({
    categories: Joi.array().items(
        Joi.object()
            .keys({
                categoryGuid: Joi.string()
                    .uuid()
                    .required(),
                experience: Joi.number()
                    .integer()
                    .min(0)
                    .max(5),
                profficience: Joi.number()
                    .integer()
                    .min(0)
                    .max(5),
                last_worked_date: Joi.date()
            })
            .required()
    )
});

module.exports.validateAddBody = (request, response, next) => {
    validateBody(request, response, next, addBodySchema);
};

module.exports.validateUpdateBody = (request, response, next) => {
    validateBody(request, response, next, updateBodySchema);
};

const validateBody = (request, response, next, schema) => {
    const result = Joi.validate(request.body, schema);
    if(result.error) {
        return response.status(BAD_REQUEST).json(result.error.details);
    }
    next();
};

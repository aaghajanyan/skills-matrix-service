const Joi = require('joi');
const { BAD_REQUEST } = require('http-status-codes');

const passwordExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})/;
const nameExp = /^[a-z]{2,20}$/i;

const addBodySchema = Joi.object().keys({
    password: Joi.string()
        .regex(passwordExp)
        .required(),
    fname: Joi.string()
        .regex(nameExp)
        .required(),
    lname: Joi.string()
        .regex(nameExp)
        .required(),
    branchGuid: Joi.string()
        .uuid()
        .required(),
    started_to_work_date: Joi.date().required(),
    role_group_id: Joi.number().integer(),
    positionGuid: Joi.string()
        .uuid()
        .required(),
});

const updateBodySchema = Joi.object().keys({
    password: Joi.string().regex(passwordExp),
    fname: Joi.string().regex(nameExp),
    lname: Joi.string().regex(nameExp),
    branchGuid: Joi.string().uuid(),
    role_group_id: Joi.number().integer(),
    positionGuid: Joi.string().uuid(),
    is_active: Joi.boolean(),
});

const loginBodySchema = Joi.object().keys({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .regex(passwordExp)
        .required(),
});

const validateLoginBody = (request, response, next) => {
    validateBody(request, response, next, loginBodySchema);
};

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
    validateLoginBody,
};

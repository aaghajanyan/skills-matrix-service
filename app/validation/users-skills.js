const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    userGuid: Joi.string().uuid().required(),
    skillGuid: Joi.string().uuid().required(),
    currentMark: Joi.number().integer().required(),
    experience: Joi.number().integer().required(),
    profficience: Joi.string().valid([
        "Juniore",
        "Mid 1",
        "Mid 2",
        "Senior"
    ]),
});

const updateBodySchema = Joi.object().keys({
    userGuid: Joi.string().uuid().required(),
    skillGuid: Joi.string().uuid().required(),
    currentMark: Joi.number().integer().required(),
    experience: Joi.number().integer().required(),
    profficience: Joi.string().valid([
        "Juniore",
        "Mid 1",
        "Mid 2",
        "Senior"
    ]),
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

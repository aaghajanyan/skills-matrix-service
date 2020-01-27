const Joi = require('joi');
const { BAD_REQUEST } = require('http-status-codes');

const addBodySchema = Joi.object().keys({
    name: Joi.string().required(),
    relatedCategoriesIds: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
    skillsIds: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
});
const updateBodySchema = Joi.object().keys({
    name: Joi.string(),
    addedCategories: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
    removedCategories: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
    addedskills: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
    removedSkills: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
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

const Joi = require("joi");

const addBodySchema = Joi.object().keys({
    name: Joi.string()
        .required(),
    relatedCategoriesIds: Joi.array()
        .items(Joi.string().uuid())
        .unique(),
    skillsIds: Joi.array()
        .items(Joi.string().uuid())
        .unique()
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
        .unique()
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

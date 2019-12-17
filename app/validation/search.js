const Joi = require("joi");

const searchBodySchema = Joi.array().items(Joi.object().keys({
    type: Joi.string().required(),
    opCondition: Joi.string().valid([
        "equal",
        "notEqual"
    ]),
    items: Joi.object().keys({
        name: Joi.string(),
        branchName: Joi.string().valid([
            "Vanadzor",
            "Erevan",
            "Goris"
        ]),
        position: Joi.string().valid([
            "Beginner SW Engineer",
            "SW Engineer",
            "Senior SW Engineer",
            "Beginner QA Tester",
            "QA Tester",
            "SQE Analyst",
            "Sr. Software Quality Engineer",
            "QA Analyst",
            "QA lead",
            "Team lead",
            "Graphic designer",
            "technical manager",
            "Senior Team lead",
            "Project Manager",
            "3D modeler",
            "UIUX designer",
            "SW Architect"
        ]),
        fname: Joi.string(),
        lname: Joi.string(),
        experience: Joi.number().integer().min(0). max(10),
        profficience: Joi.string().valid([
            "Juniore",
            "Mid 1",
            "Mid 2",
            "Senior"
        ]),
      }),
    isActive: Joi.boolean()
}));

const validateSearchBodySchema = (request, response, next) => {
    validateBody(request, response, next, searchBodySchema);
};

function validateBody(request, response, next, schema) {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(400).json(result.error.details);
    }
    next();
}

module.exports = {
    validateSearchBodySchema
};
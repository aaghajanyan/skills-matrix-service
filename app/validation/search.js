const Joi = require("joi");

const searchBodySchema = Joi.array().items(Joi.object().keys({
    type: Joi.string().valid([
        "user",
        "branch",
        "position",
        "skill",
        "category"
    ]),
    opCondition: Joi.string().valid([
        "equal",
        "not equal"
    ]),
    relCondition: Joi.string().valid([
        "and"
        // "or"
    ]),
    items: Joi.object().keys({
        name: Joi.string().valid([
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
            "SW Architect",
            "Vanadzor",
            "Erevan",
            "Goris"
        ]),
        fname: Joi.string(),
        lname: Joi.string(),
        experience: Joi.number().integer().min(0). max(100),
        profficience: Joi.number().integer().min(0). max(5),
        id: Joi.string().uuid(),
      }),
    isActive: Joi.boolean()
}));

const validateSearchBodySchema = (request, response, next) => {
    validateBody(request, response, next, searchBodySchema);
};

function validateBody(request, response, next, schema) {
    try {
        const result = Joi.validate(request.body, schema);
        if (result.error) {
            return response.status(400).json(result.error.details);
        }
        next();
    } catch(error) {
        return response.status(400).json(error.details);
    }

}

module.exports = {
    validateSearchBodySchema
};

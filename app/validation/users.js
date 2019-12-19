const Joi = require("joi");

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
    branchName: Joi.string()
        .regex(nameExp)
        .required(),
    startedToWorkDate: Joi.date()
        .required(),
    roleGroupId: Joi.number()
        .integer(),
    position: Joi.string()
        .required()
});

const updateBodySchema = Joi.object().keys({
    password: Joi.string()
        .regex(passwordExp),
    fname: Joi.string()
        .regex(nameExp),
    lname: Joi.string()
        .regex(nameExp),
    branchName: Joi.string()
        .regex(nameExp),
    roleGroupId: Joi.number()
        .integer(),
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
    isActive: Joi.boolean()
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

function validateBody(request, response, next, schema) {
    const result = Joi.validate(request.body, schema);
    if (result.error) {
        return response.status(400).json(result.error.details);
    }
    next();
}

module.exports = {
    validateAddBody,
    validateUpdateBody,
    validateLoginBody
};
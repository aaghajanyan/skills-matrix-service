const Joi = require('joi');

const emptyQueryParamSchema = Joi.object().keys({
    type: Joi.string()
        .valid(['group'])
        .required(),
    id: Joi.string()
        .min(1)
        .max(32)
        .required(),
    condition: Joi.string()
        .valid(['Or', 'And'])
        .required(),
    childrens: Joi.object()
        .pattern(
            /^/,
            Joi.object().keys({
                type: Joi.string()
                    .valid(['rule', 'group'])
                    .required(),
                properties: Joi.object()
                    .keys({})
                    .required(),
            })
        )
        .required(),
});

const groupSchema = Joi.object().keys({
    type: Joi.string()
        .valid(['rule', 'group'])
        .required(),
    id: Joi.string()
        .min(1)
        .max(32),
    condition: Joi.string()
        .valid(['Or', 'And'])
        .required(),
    childrens: Joi.object()
        .keys({})
        .required()
        .unknown(true),
});

const ruleSchema = Joi.object().keys({
    type: Joi.string()
        .valid(['rule', 'group'])
        .required(),
    properties: Joi.object().keys({
        type: Joi.string()
            .valid(['Skill', 'Category', 'Branch', 'Position'])
            .required(),
        opCondition: Joi.string()
            .valid(['equal', 'not equal'])
            .required(),
        name: Joi.string()
            .min(1)
            .max(32)
            .required(),
        experience: Joi.string().valid(['1', '2', '3', '4', '5']).optional(),
        proficiency: Joi.string().valid(['1', '2', '3', '4', '5']).optional(),
        last_worked_date: Joi.date().allow(null),
    })
});

module.exports.validateEmptyQueryBodySchema = data => {
    return validateBody(data, emptyQueryParamSchema);
};

module.exports.validateGroupBodySchema = data => {
    return validateBody(data, groupSchema);
};

module.exports.validateRuleBodySchema = data => {
    return validateBody(data, ruleSchema);
};
const validateBody = (data, schema) => {
    const result = Joi.validate(data, schema);
    return result.error;
};

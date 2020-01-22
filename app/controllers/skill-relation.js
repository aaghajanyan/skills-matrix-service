const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CONFLICT,
    CREATED
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const Skill = require('../models/skill');
const Category = require('../models/category');
const SkillRelation = require('../models/skill-relation');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getSkillsRelations = async function(_, response) {
    try {
        const skillsRelations = await SkillRelation.findAll();
        return response.status(OK).json(skillsRelations);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.SKILL_REL.toLowerCase()
            )}`,
        });
    }
};

const getSkillRelation = async function(request, response) {
    try {
        const skillRelation = await SkillRelation.findByPk(
            request.params.skillRelationId
        );
        response.status(OK).json(skillRelation);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.SKILL_REL.toLowerCase()
            )}`,
        });
    }
};

const addSkillRelation = async function(request, response) {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            const skill = await Skill.findByPk(request.body.skill_id);
            if (skill) {
                const skillRelation = await SkillRelation.create(request.body);
                response.status(CREATED).json({ id: skillRelation.id });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.SKILL
                    )}`,
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.CATEGORY
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.SKILL_REL
            )}`,
        });
    }
};

const updateSkillRelation = async function(request, response) {
    try {
        const category = await Category.findByPk(request.body.categoryId);
        if (category) {
            await SkillRelation.update(request.body, {
                id: request.params.skillRelationId,
            });
            response.status(ACCEPTED).json({ success: true });
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.CATEGORY
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.SKILL_REL.toLowerCase()
            )}`,
        });
    }
};

const deleteSkillRelation = async function(request, response) {
    try {
        await SkillRelation.delete({ id: request.params.skillRelationId });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.SKILL_REL.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getSkillsRelations,
    getSkillRelation,
    addSkillRelation,
    updateSkillRelation,
    deleteSkillRelation,
};

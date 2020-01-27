const {OK, INTERNAL_SERVER_ERROR, ACCEPTED, CONFLICT, CREATED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Skill = require('../models/skill');
const Category = require('../models/category');
const SkillRelation = require('../models/skillRelation');
const logger = require('../helper/logger');

module.exports.getSkillsRelations = async (_, response) => {
    try {
        const skillsRelations = await SkillRelation.findAll();
        return response.status(OK).json(skillsRelations);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send(responseBuilder.couldNotGetCriteria(Constants.TypeNames.SKILL_RELS.toLowerCase()));
    }
};

module.exports.getSkillRelation = async (request, response) => {
    try {
        const skillRelation = await SkillRelation.findByPk(request.params.skillRelationId);
        response.status(OK).json(skillRelation);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(responseBuilder.couldNotGetCriteria(Constants.TypeNames.SKILL_REL.toLowerCase(), request.params.skillRelationId));
    }
};

module.exports.addSkillRelation = async (request, response) => {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            const skill = await Skill.findByPk(request.body.skill_id);
            if (skill) {
                const skillRelation = await SkillRelation.create(request.body);
                response.status(CREATED).json({ id: skillRelation.id });
            } else {
                return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.body.skill_id));
            }
        } else {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.CATEGORY.toLowerCase(), request.body.category_id));
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send(responseBuilder.couldNotAddCriteria(Constants.TypeNames.SKILL_REL));
    }
};

module.exports.updateSkillRelation = async (request, response) => {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            await SkillRelation.update(request.body, {
                id: request.params.skillRelationId,
            });
            response.status(ACCEPTED).json({ success: true });
        } else {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.CATEGORY.toLowerCase(), request.body.category_id));
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.SKILL_REL.toLowerCase(), request.params.skillRelationId));
    }
};

module.exports.deleteSkillRelation = async (request, response) => {
    try {
        await SkillRelation.delete({ id: request.params.skillRelationId });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.SKILL_REL.toLowerCase(), request.params.skillRelationId));
    }
};

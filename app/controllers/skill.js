const {OK, INTERNAL_SERVER_ERROR, CONFLICT, ACCEPTED, CREATED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Skill = require('../models/skill');
const logger = require('../helper/logger');


module.exports.getSkills = async (_, response) => {
    try {
        const skills = await Skill.findAll();
        return response.status(OK).json(skills);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.SKILL.toLowerCase()));
    }
};

module.exports.getSkill = async (request, response) => {
    try {
        const skill = await Skill.find({ guid: request.params.guid });
        return response.status(OK).json(skill);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.params.guid));
    }
};

module.exports.getSkillAllData = async (request, response) => {
    try {
        const skill = await Skill.getSkillAllData(request.params.guid);
        return response.status(OK).json(skill);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.params.guid));
    }
};

module.exports.getSkillsAllData = async (request, response) =>{
    try {
        const skills = await Skill.getSkillsAllData();
        return response.status(OK).json(skills);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.SKILL.toLowerCase()));
    }
};

module.exports.addSkill = async (request, response) => {
    const { categoriesId, ...skillData } = request.body;
    if (categoriesId && categoriesId.length > 0) {
        try {
            const { skill, isNewRecord } = await Skill.findOrCreateSkill({
                name: skillData.name,
                icon: skillData.icon,
            });
            if (!isNewRecord) {
                return response.status(OK).json(responseBuilder.alreadyExistsCriteria(Constants.TypeNames.SKILL.toLowerCase(), skill.name, skill.icon));
            }
            const sendedList = [];
            await Skill.addedNewCategories(categoriesId, skill, sendedList, true);
            let status = (await Skill.getStatus(sendedList, Constants.Keys.addedCategories)) ? CREATED : CONFLICT;

            if (status === CONFLICT && categoriesId.length === 1) {
                skill.destroy();
                return response
                    .status(CONFLICT)
                    .json(responseBuilder.couldNotAddCriteria(
                        Constants.TypeNames.SKILL.toLowerCase() + ' ' + skill.name + ' ' + skill.icon,
                        Constants.Controllers.CategoryRelation.CATEGORY_DOES_NOT_EXISTS)
                    );
            }
            return response.status(status).json({
                [Constants.Keys.name]: skill.name,
                [Constants.Keys.guid]: skill.guid,
                [Constants.Keys.icon]: skill.icon,
                [Constants.Keys.addedCategories]: sendedList.addedCategories,
                ...sendedList,
            });
        } catch (error) {
            logger.error(error);
            return response.status(CONFLICT).json(responseBuilder.couldNotAddCriteria(Constants.TypeNames.SKILL.toLowerCase()));
        }
    } else {
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(responseBuilder.couldNotAddCriteria(Constants.TypeNames.SKILL.toLowerCase(), Constants.Controllers.CategoryRelation.CATEGORY_DOES_NOT_EXISTS));
    }
};

module.exports.updateSkillAllData = async (request, response) => {
    try {
        const { addCategories, deleteCategories, ...skillData } = request.body;
        const sendedList = [];
        const existingSkill = await Skill.findOneSkill({
            guid: request.params.guid,
        });

        if (!existingSkill) {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.params.guid));
        }
        await Skill.updateSkill(skillData, { guid: request.params.guid });
        await Skill.addedNewCategories(addCategories, existingSkill, sendedList, false);
        await Skill.removeCategories(deleteCategories, sendedList, existingSkill);
        return response.status(201).json({
            [Constants.Keys.addedCategories]: sendedList.addedCategories,
            [Constants.Keys.removedCategories]: sendedList.removedCategories,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.params.guid));
    }
};

module.exports.updateSkill = async (request, response) => {
    try {
        await Skill.updateSkill(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.params.guid));
    }
};

module.exports.deleteSkill = async (request, response) => {
    try {
        await Skill.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.SKILL.toLowerCase(), request.params.guid));
    }
};

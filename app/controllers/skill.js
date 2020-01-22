const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED
} = require('http-status-codes');
const Skill = require('../models/skill');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getSkills = async function(_, response) {
    try {
        const skills = await Skill.findAll();
        return response.status(OK).json(skills);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const getSkill = async function(request, response) {
    try {
        const skill = await Skill.find({ guid: request.params.guid });
        return response.status(OK).json(skill);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const getSkillAllData = async function(request, response) {
    try {
        const skill = await Skill.getSkillAllData(request.params.guid);
        return response.status(OK).json(skill);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const getSkillsAllData = async function(request, response) {
    try {
        const skills = await Skill.getSkillsAllData();
        return response.status(OK).json(skills);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const addSkill = async function(request, response) {
    const { categoriesId, ...skillData } = request.body;
    if (categoriesId && categoriesId.length > 0) {
        try {
            const { skill, isNewRecord } = await Skill.findOrCreateSkill({
                name: skillData.name,
            });
            if (!isNewRecord) {
                return response.status(OK).json({
                    success: false,
                    message: `${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                        Constants.Controllers.TypeNames.SKILL
                    )}`,
                });
            }
            const sendedList = [];
            await Skill.addedNewCategories(categoriesId, skill, sendedList, true);
            let status = (await Skill.getStatus(
                sendedList,
                Constants.Keys.addedCategories
            ))
                ? CREATED
                : CONFLICT;
            if (status === CONFLICT && categoriesId.length === 1) {
                skill.destroy();
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                        Constants.Controllers.TypeNames.SKILL.toLowerCase()
                    )}`,
                });
            }

            return response.status(status).json({
                [Constants.Keys.name]: skill.name,
                [Constants.Keys.guid]: skill.guid,
                [Constants.Keys.addedCategories]: sendedList.addedCategories,
                ...sendedList,
            });
        } catch (error) {
            logger.error(error);
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                    Constants.Controllers.TypeNames.SKILL.toLowerCase()
                )}`,
            });
        }
    } else {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const updateSkillAllData = async function(request, response) {
    try {
        const { addCategories, deleteCategories, ...skillData } = request.body;
        const sendedList = [];
        const existingSkill = await Skill.findOneSkill({
            guid: request.params.guid,
        });

        if (!existingSkill) {
            return response.status(CONFLICT).json({
                success: false,
                message: ErrorMessageParser.elementDoesNotExist(
                    Constants.Controllers.TypeNames.SKILL,
                    request.params.guid,
                    Constants.Keys.id
                ),
            });
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
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const updateSkill = async function(request, response) {
    try {
        await Skill.updateSkill(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

const deleteSkill = async function(request, response) {
    try {
        await Skill.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.SKILL.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getSkills,
    getSkill,
    getSkillAllData,
    getSkillsAllData,
    addSkill,
    updateSkill,
    updateSkillAllData,
    deleteSkill,
};

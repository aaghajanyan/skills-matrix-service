const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
    getStatusText,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const User = require('../models/user');
const Skill = require('../models/skill');
const UserSkill = require('../models/users-skills');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getUsersSkills = async function(_, response) {
    try {
        const usersSkills = await UserSkill.findAll();
        return response.status(OK).json(usersSkills);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
            )}`,
        });
    }
};

const getUserSkills = async function(request, response) {
    try {
        const userSkills = await UserSkill.find({
            guid: request.params.userSkillGuid,
        });
        return response.status(OK).json(userSkills);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
            )}`,
        });
    }
};

const addUserSkill = async function(request, response) {
    const expectedResponse = {
        errors: [],
        items: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const { skills } = request.body;
            for (skill of skills) {
                const existingSkill = await Skill.find({
                    guid: skill.skillGuid,
                });
                if (existingSkill) {
                    skill.user_id = user.id;
                    skill.skill_id = existingSkill.id;
                    try {
                        const userSkill = await UserSkill.create(skill);
                        status = CREATED;
                        expectedResponse.items.push(userSkill);
                    } catch (error) {
                        expectedResponse.errors.push({
                            success: false,
                            error: `${ErrorMessageParser.stringFormatter(
                                Constants.Controllers.UserSkills.ALREADY_EXISTS,
                                skill.skillGuid
                            )}`,
                        });
                    }
                } else {
                    expectedResponse.errors.push({
                        success: false,
                        error: `${ErrorMessageParser.elementDoesNotExist(
                            Constants.Controllers.TypeNames.SKILL,
                            skill.skillGuid,
                            Constants.Keys.guid
                        )}`,
                    });
                }
            }
            return response.status(status).json({ expectedResponse });
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    CONFLICT
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
            )}`,
        });
    }
};

const updateUserSkill = async function(request, response) {
    try {
        const expectedResponse = {
            success: false,
            errors: [],
        };
        let status = CONFLICT;
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const { skills } = request.body;
            for (skill of skills) {
                const existingSkill = await Skill.find({
                    guid: skill.skillGuid,
                });
                if (existingSkill) {
                    await UserSkill.update(skill, {
                        user_id: user.id,
                        skill_id: existingSkill.id,
                    });
                    status = OK;
                } else {
                    expectedResponse.errors.push({
                        success: false,
                        error: `${ErrorMessageParser.elementDoesNotExist(
                            Constants.Controllers.TypeNames.SKILL,
                            skill.skillGuid,
                            Constants.Keys.guid
                        )}`,
                    });
                }
            }
            expectedResponse.success = status === CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    CONFLICT
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
            )}`,
        });
    }
};

const deleteUserSkill = async function(request, response) {
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const skill = await Skill.find({ guid: request.body.skillGuid });
            if (skill) {
                await UserSkill.delete({
                    user_id: user.id,
                    skill_id: skill.id,
                });
                return response.status(ACCEPTED).json({ success: true });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${getStatusText(
                        CONFLICT
                    )}. ${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                        Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
                    )} ${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.SKILL
                    )}`,
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    CONFLICT
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                    Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
                )} ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
            )}`,
        });
    }
};

const deleteUserSkillById = async function(request, response) {
    try {
        await UserSkill.delete({ id: request.params.userSkillGuid });
        response.status(ACCEPTED).end();
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.USER_SKILL.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getUserSkills,
    getUsersSkills,
    addUserSkill,
    updateUserSkill,
    deleteUserSkill,
    deleteUserSkillById,
};

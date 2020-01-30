const {OK, INTERNAL_SERVER_ERROR, CONFLICT, ACCEPTED, CREATED} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const User = require('../models/user');
const Skill = require('../models/skill');
const UserSkill = require('../models/usersSkills');
const SkillHistory = require('../models/skillsHistory');
const logger = require('../helper/logger');

module.exports.getUsersSkills = async (_, response) => {
    try {
        const usersSkills = await UserSkill.findAll();
        return response.status(OK).json(usersSkills);
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.USER_SKILLS.toLowerCase()));
    }
};

module.exports.getUserSkills = async (request, response) => {
    try {
        const userSkills = await UserSkill.find({
            guid: request.params.userSkillGuid
        });
        return response.status(OK).json(userSkills);
    } catch(error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.USER_SKILLS.toLowerCase(), request.params.userSkillGuid));
    }
};

module.exports.addUserSkill = async (request, response) => {
    const expectedResponse = {
        errors: [],
        items: []
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({guid: request.params.userGuid});
        if(user) {
            const {skills} = request.body;
            const promise = skills.map(async (skill) => {
                const existingSkill = await Skill.find({
                    guid: skill.skillGuid
                });
                if(existingSkill) {
                    skill.user_id = user.id;
                    skill.skill_id = existingSkill.id;
                    try {
                        const userSkillData = await UserSkill.find({
                            user_id: user.id,
                            skill_id: existingSkill.id
                        });
                        if(userSkillData) {
                            await addUserSkillAndUpdateHistory(skill, userSkillData, user, existingSkill);
                            status = OK;
                            expectedResponse.items.push(userSkillData);
                        } else {
                            const userSkill = await UserSkill.create(skill);
                            status = CREATED;
                            expectedResponse.items.push(userSkill);
                        }
                    } catch(error) {
                        expectedResponse.errors.push(responseBuilder.alreadyExistsCriteria(Constants.TypeNames.USER_SKILL.toLowerCase(), existingSkill.name));
                    }
                } else {
                    expectedResponse.errors.push(responseBuilder.doesNotExistCriteria(Constants.TypeNames.SKILL, skill.skillGuid));
                }

            });
            await Promise.all(promise).catch(err => logger.error(err));
            return response.status(status).json({expectedResponse});
        } else {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.USER, request.params.userGuid));
        }
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            responseBuilder.couldNotAddCriteria(Constants.TypeNames.USER_SKILL.toLowerCase()) // TODO
        );
    }
};

const addUserSkillAndUpdateHistory = async (skill, userSkillData, user, existingSkill) => {
    const dataValues = userSkillData.dataValues;
    dataValues.created_date = new Date();
    delete dataValues.guid;
    await SkillHistory.findOrCreate(dataValues, {
        user_id: user.id,
        skill_id: existingSkill.id,
        experience: userSkillData.experience,
        profficience: userSkillData.profficience
    });
    await UserSkill.update(skill, {
        user_id: user.id,
        skill_id: existingSkill.id
    });
};

module.exports.updateUserSkill = async (request, response) => {
    try {
        const expectedResponse = {
            success: false,
            errors: []
        };
        let status = CONFLICT;
        const user = await User.findOne({guid: request.params.userGuid});
        if(user) {
            const {skills} = request.body;
            const promise = skills.map(async (skill) => {
                const existingSkill = await Skill.find({
                    guid: skill.skillGuid
                });
                if(existingSkill) {
                    await UserSkill.update(skill, {
                        user_id: user.id,
                        skill_id: existingSkill.id
                    });
                    status = OK;
                } else {
                    expectedResponse.errors.push(responseBuilder.doesNotExistCriteria(Constants.TypeNames.SKILL, skill.skillGuid));
                }
            });
            await Promise.all(promise).catch(err => logger.error(err));
            expectedResponse.success = status === CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.USER, request.params.userGuid));
        }
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.USER_SKILL));
    }
};

module.exports.deleteUserSkill = async (request, response) => {
    try {
        const user = await User.findOne({guid: request.params.userGuid});
        if(user) {
            const skill = await Skill.find({guid: request.body.skillGuid});
            if(skill) {
                await UserSkill.delete({
                    user_id: user.id,
                    skill_id: skill.id
                });
                return response.status(ACCEPTED).json({success: true});
            } else {
                return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.SKILL, request.body.skillGuid));
            }
        } else {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.USER, request.params.userGuid));
        }
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.USER_SKILL.toLowerCase()));
    }
};

module.exports.deleteUserSkillById = async (request, response) => {
    try {
        await UserSkill.delete({id: request.params.userSkillGuid});
        response.status(ACCEPTED).end();
    } catch(error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotDeleteCriteria(Constants.TypeNames.USER_SKILL.toLowerCase()));
    }
};

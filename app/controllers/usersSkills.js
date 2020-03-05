const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const User = require('../models/user');
const Skill = require('../models/skill');
const UserSkill = require('../models/usersSkills');
const SkillHistory = require('../models/skillsHistory');
const logger = require('../helper/logger');
const config = require('../sequelize/config/config');

/**
 * @swagger
 * /users_skills:
 *  get:
 *      summary: Get users skills
 *      tags: [User skills]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get users skills.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getUsersSkills = async (_, response) => {
    try {
        const usersSkills = await UserSkill.findAll();
        return response.status(OK).json(usersSkills);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.USER_SKILLS.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /users_skills/{user_skill_guid}:
 *  get:
 *      summary: Get user skills by skill guid
 *      tags: [User skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: user_skill_guid
 *            description: GUID of user skill to return
 *            required: true
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get user skills.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getUserSkills = async (request, response) => {
    try {
        const userSkills = await UserSkill.find({
            guid: request.params.userSkillGuid,
        });
        return response.status(OK).json(userSkills);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.USER_SKILLS.toLowerCase(),
                    request.params.userSkillGuid
                )
            );
    }
};

/**
 * @swagger
 * /users_skills/{user_guid}:
 *   post:
 *     summary: Add skill for user
 *     tags: [User skills]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_guid
 *         required: true
 *       - in: body
 *         name: body
 *         description: User skill object that needs to be added
 *         schema:
 *           $ref: '#/definitions/userSkillsArray'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add user skills.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addUserSkill = async (request, response) => {
    const expectedResponse = {
        errors: [],
        items: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const { skills } = request.body;
            const promise = skills.map(async skill => {
                const existingSkill = await Skill.find({
                    guid: skill.skillGuid,
                });
                if (existingSkill) {
                    skill.user_id = user.id;
                    skill.skill_id = existingSkill.id;
                    try {
                        const userSkillData = await UserSkill.find({
                            user_id: user.id,
                            skill_id: existingSkill.id,
                        });
                        if (!userSkillData) {
                            skill.created_date = new Date();
                            skill.operation = config.operations[0];
                            await SkillHistory.create(skill);
                            const userSkill = await UserSkill.create(skill);
                            status = CREATED;
                            expectedResponse.items.push(userSkill);
                        } else {
                            await addUserSkillAndUpdateHistory(
                                user,
                                skill
                            );
                            status = OK;
                            expectedResponse.items.push(userSkillData);
                        }
                    } catch (error) {
                        expectedResponse.errors.push(
                            responseBuilder.alreadyExistsCriteria(
                                Constants.TypeNames.USER_SKILL.toLowerCase(),
                                existingSkill.name
                            )
                        );
                    }
                } else {
                    expectedResponse.errors.push(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.SKILL,
                            skill.skillGuid
                        )
                    );
                }
            });
            await Promise.all(promise).catch(err => logger.error(err));
            return response.status(status).json({ expectedResponse });
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.params.userGuid
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(
            responseBuilder.couldNotAddCriteria(
                Constants.TypeNames.USER_SKILL.toLowerCase()
            ) // TODO
        );
    }
};

const addUserSkillAndUpdateHistory = async (
    user,
    existingSkill
) => {
    const dataValues = existingSkill;
    dataValues.created_date = new Date();
    delete dataValues.guid;
    dataValues.operation = config.operations[1];
    await SkillHistory.create(dataValues);
    await UserSkill.update(existingSkill, {
        user_id: user.id,
        skill_id: existingSkill.skill_id,
    });
};

/**
 * @swagger
 * /users_skills/history/{user_guid}:
 *   get:
 *     summary: Get user skill history
 *     tags: [User skills history]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_guid
 *         required: true
 *       - in: body
 *         name: body
 *         description: User skill object history
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Conflict.
 *       500:
 *         description: Could not add user category.
 *
 *     security:
 *       - bearerAuth: []
 *
 */

module.exports.getSkillsHistory = async (request, response) => {
    const user = await User.getByGuid(request.params.userGuid);
    const historySkills = await SkillHistory.findByUserId(user.id);
    return response.status(OK).json({ historySkills });
}

/**
 * @swagger
 * /users_skills/{user_guid}:
 *   put:
 *     summary: Update user skill
 *     tags: [User skills]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_guid
 *         required: true
 *       - in: body
 *         name: body
 *         description: User skill object that needs to be updated
 *         schema:
 *           $ref: '#/definitions/userSkillsArray'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Conflict.
 *       500:
 *         description: Could not add user category.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.updateUserSkill = async (request, response) => {
    try {
        const expectedResponse = {
            success: false,
            errors: [],
        };
        let status = CONFLICT;
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const { skills } = request.body;
            const promise = skills.map(async skill => {
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
                    expectedResponse.errors.push(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.SKILL,
                            skill.skillGuid
                        )
                    );
                }
            });
            await Promise.all(promise).catch(err => logger.error(err));
            expectedResponse.success = status === CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.params.userGuid
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.USER_SKILL
                )
            );
    }
};

/**
 * @swagger
 * /users_skills/{user_guid}:
 *  delete:
 *      summary: Delete user skill
 *      tags: [User skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: user_guid
 *            required: true
 *          - in: body
 *            name: body
 *            description: User skill object to delete
 *            schema:
 *              $ref: '#/definitions/deleteUserSkill'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted.
 *          401:
 *              description: Unauthorized.
 *          409:
 *              description: Conflict.
 *          500:
 *              description: Could not delete user skill.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteUserSkill = async (request, response) => {
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const skill = await Skill.find({ guid: request.body.skillGuid });
            if (skill) {
                const oldSkill = {
                    experience: 0,
                    profficience: 0,
                    last_worked_date: new Date(),
                    user_id: user.id,
                    skill_id: skill.dataValues.id,
                    operation: config.operations[2]
                }
                oldSkill.created_date = new Date();
                await SkillHistory.create(oldSkill);
                await UserSkill.delete({
                    user_id: user.id,
                    skill_id: skill.id,
                });
                return response.status(ACCEPTED).json({ success: true });
            } else {
                return response
                    .status(CONFLICT)
                    .json(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.SKILL,
                            request.body.skillGuid
                        )
                    );
            }
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.params.userGuid
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.USER_SKILL.toLowerCase()
                )
            );
    }
};

module.exports.deleteUserSkillById = async (request, response) => {
    try {
        await UserSkill.delete({ id: request.params.userSkillGuid });
        response.status(ACCEPTED).end();
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.USER_SKILL.toLowerCase()
                )
            );
    }
};

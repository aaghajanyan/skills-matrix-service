const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Skill = require('../models/skill');
const logger = require('../helper/logger');

/**
 * @swagger
 * /skills:
 *  get:
 *      summary: Get all skills
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get skills.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getSkills = async (_, response) => {
    try {
        const skills = await Skill.findAll();
        return response.status(OK).json(skills);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.SKILL.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /skills/{skill_guid}:
 *  get:
 *      summary: Get skill by guid
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_guid
 *            description: GUID of skill to return
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
 *              description: Could not get skill by id.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getSkill = async (request, response) => {
    try {
        const skill = await Skill.find({ guid: request.params.guid });
        return response.status(OK).json(skill);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.SKILL.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /skills/all/{skill_guid}:
 *  get:
 *      summary: Get skills all data by skill guid
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_guid
 *            description: GUID of skill to return
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
 *              description: Could not get skill all data.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getSkillAllData = async (request, response) => {
    try {
        const skill = await Skill.getSkillAllData(request.params.guid);
        return response.status(OK).json(skill);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.SKILL.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /skills/all:
 *  get:
 *      summary: Get skills all data
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get skills all data.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getSkillsAllData = async (request, response) => {
    try {
        const skills = await Skill.getSkillsAllData();
        return response.status(OK).json(skills);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.SKILL.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Add new skill
 *     tags: [Skills]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Skill object that needs to be added
 *         schema:
 *           $ref: '#/definitions/addSkill'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new skill.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addSkill = async (request, response) => {
    const { categoriesId, ...skillData } = request.body;
    if (categoriesId && categoriesId.length > 0) {
        try {
            const { skill, isNewRecord } = await Skill.findOrCreateSkill({
                name: skillData.name,
                icon: skillData.icon,
            });
            if (!isNewRecord) {
                return response
                    .status(OK)
                    .json(
                        responseBuilder.alreadyExistsCriteria(
                            Constants.TypeNames.SKILL.toLowerCase(),
                            skill.name,
                            skill.icon
                        )
                    );
            }
            const sendedList = [];
            await Skill.addedNewCategories(
                categoriesId,
                skill,
                sendedList,
                true
            );
            let status = (await Skill.getStatus(
                sendedList,
                Constants.Keys.addedCategories
            ))
                ? CREATED
                : CONFLICT;

            if (status === CONFLICT && categoriesId.length === 1) {
                skill.destroy();
                return response
                    .status(CONFLICT)
                    .json(
                        responseBuilder.couldNotAddCriteria(
                            Constants.TypeNames.SKILL.toLowerCase() +
                                ' ' +
                                skill.name +
                                ' ' +
                                skill.icon,
                            Constants.Controllers.CategoryRelation
                                .CATEGORY_DOES_NOT_EXISTS
                        )
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
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.couldNotAddCriteria(
                        Constants.TypeNames.SKILL.toLowerCase()
                    )
                );
        }
    } else {
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.SKILL.toLowerCase(),
                    Constants.Controllers.CategoryRelation
                        .CATEGORY_DOES_NOT_EXISTS
                )
            );
    }
};

/**
 * @swagger
 * /skills/all/{skill_guid}:
 *  put:
 *      summary: Update skill all data by guid
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_guid
 *            required: true
 *          - in: body
 *            name: body
 *            description: Skill object that needs to be updated
 *            schema:
 *              $ref: '#/definitions/updateSkillAllData'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not update skill all data.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateSkillAllData = async (request, response) => {
    try {
        const { addCategories, deleteCategories, ...skillData } = request.body;
        const sendedList = [];
        const existingSkill = await Skill.findOneSkill({
            guid: request.params.guid,
        });

        if (!existingSkill) {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.SKILL.toLowerCase(),
                        request.params.guid
                    )
                );
        }
        await Skill.updateSkill(skillData, { guid: request.params.guid });
        await Skill.addedNewCategories(
            addCategories,
            existingSkill,
            sendedList,
            false
        );
        await Skill.removeCategories(
            deleteCategories,
            sendedList,
            existingSkill
        );
        return response.status(201).json({
            [Constants.Keys.addedCategories]: sendedList.addedCategories,
            [Constants.Keys.removedCategories]: sendedList.removedCategories,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.SKILL.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /skills/{skill_guid}:
 *  put:
 *      summary: Update skill by guid
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_guid
 *            required: true
 *          - in: body
 *            name: skill body
 *            description: Skill object that needs to be updated
 *            schema:
 *              $ref: '#/definitions/updateSkill'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not update skill.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateSkill = async (request, response) => {
    try {
        await Skill.updateSkill(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.SKILL.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /skills/{skill_guid}:
 *  delete:
 *      summary: Delete skill by guid
 *      tags: [Skills]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_guid
 *            description: Skill guid to delete
 *            required: true
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted.
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not delete skill.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteSkill = async (request, response) => {
    try {
        await Skill.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.SKILL.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

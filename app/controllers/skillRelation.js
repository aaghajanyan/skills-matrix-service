const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CONFLICT,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Skill = require('../models/skill');
const Category = require('../models/category');
const SkillRelation = require('../models/skillRelation');
const logger = require('../helper/logger');

/**
 * @swagger
 * /skills_relations:
 *  get:
 *      summary: Get skills relations
 *      tags: [Skills relation]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get skills relations.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getSkillsRelations = async (_, response) => {
    try {
        const skillsRelations = await SkillRelation.findAll();
        return response.status(OK).json(skillsRelations);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.SKILL_RELS.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /skills_relations/{skill_relation_id}:
 *  get:
 *      summary: Get skill relation by id
 *      tags: [Skills relation]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_relation_id
 *            description: ID of skill relation to return
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
 *              description: Could not get skill relation by id.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getSkillRelation = async (request, response) => {
    try {
        const skillRelation = await SkillRelation.findByPk(
            request.params.skillRelationId
        );
        response.status(OK).json(skillRelation);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.SKILL_REL.toLowerCase(),
                    request.params.skillRelationId
                )
            );
    }
};

/**
 * @swagger
 * /skills_relations:
 *   post:
 *     summary: Add new skill relation
 *     tags: [Skills relation]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Skill relation object that needs to be added
 *         schema:
 *           $ref: '#/definitions/skillsRelation'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new skill relation.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addSkillRelation = async (request, response) => {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            const skill = await Skill.findByPk(request.body.skill_id);
            if (skill) {
                const skillRelation = await SkillRelation.create(request.body);
                response.status(CREATED).json({ id: skillRelation.id });
            } else {
                return response
                    .status(CONFLICT)
                    .json(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.SKILL.toLowerCase(),
                            request.body.skill_id
                        )
                    );
            }
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.CATEGORY.toLowerCase(),
                        request.body.category_id
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.SKILL_REL
                )
            );
    }
};

/**
 * @swagger
 * /skills_relations/{skill_relation_id}:
 *  put:
 *      summary: Update skill relation by id
 *      tags: [Skills relation]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_relation_id
 *            required: true
 *          - in: body
 *            name: body
 *            description: Skill relation object that needs to be updated
 *            schema:
 *              $ref: '#/definitions/updateSkillRelation'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not update skill relation.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateSkillRelation = async (request, response) => {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            await SkillRelation.update(request.body, {
                id: request.params.skillRelationId,
            });
            response.status(ACCEPTED).json({ success: true });
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.CATEGORY.toLowerCase(),
                        request.body.category_id
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.SKILL_REL.toLowerCase(),
                    request.params.skillRelationId
                )
            );
    }
};

/**
 * @swagger
 * /skills_relations/{skill_relation_id}:
 *  delete:
 *      summary: Delete skill relation by id
 *      tags: [Skills relation]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: skill_relation_id
 *            description: Skill relation id to delete
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
 *              description: Could not delete skill relation.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteSkillRelation = async (request, response) => {
    try {
        await SkillRelation.delete({ id: request.params.skillRelationId });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.SKILL_REL.toLowerCase(),
                    request.params.skillRelationId
                )
            );
    }
};

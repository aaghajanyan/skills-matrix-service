const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Criteria = require('../models/criteria');
const logger = require('../helper/logger');

/**
 * @swagger
 * /criteria:
 *  get:
 *      summary: Get all criterias
 *      tags: [Criteria]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get criterias.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCriteries = async (_, response) => {
    try {
        const criteries = await Criteria.findAll();
        return response.status(OK).json(criteries);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.CRITERIAS.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /criteria/{criteria_guid}:
 *  get:
 *      summary: Get criteria by guid
 *      tags: [Criteria]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: criteria_guid
 *            description: GUID of criteria to return
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
 *              description: Could not get criteria by guid.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCriteria = async (request, response) => {
    try {
        const criteria = await Criteria.find({ guid: request.params.guid });
        response.status(OK).json(criteria);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.CRITERIA.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /criteria:
 *   post:
 *     summary: Add new criteria
 *     tags: [Criteria]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Criteria object that needs to be added
 *         schema:
 *           $ref: '#/definitions/criteria'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new criteria.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addCriteria = async (request, response) => {
    try {
        const { criteria, isNewRecord } = await Criteria.findOrCreate({
            name: request.body.name,
            type: request.body.type,
        });
        if (!isNewRecord) {
            return response
                .status(OK)
                .json(
                    responseBuilder.alreadyExistsCriteria(
                        Constants.TypeNames.CRITERIA.toLowerCase(),
                        request.body.name
                    )
                );
        }
        return response.status(CREATED).json({
            criteria,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.CRITERIA.toLowerCase(),
                    request.body.name
                )
            );
    }
};

/**
 * @swagger
 * /criteria/{criteria_guid}:
 *  put:
 *      summary: Update criteria by guid
 *      tags: [Criteria]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: criteria_guid
 *            required: true
 *          - in: body
 *            name: body
 *            description: Criteria object that needs to be updated
 *            schema:
 *              $ref: '#/definitions/criteria'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not update criteria.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateCriteria = async (request, response) => {
    try {
        await Criteria.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.CRITERIA.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /criteria/{criteria_guid}:
 *  delete:
 *      summary: Delete criteria by guid
 *      tags: [Criteria]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: criteria_guid
 *            description: Criteria guid to delete
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
 *              description: Could not delete criteria.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteCriteria = async (request, response) => {
    try {
        await Criteria.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.CRITERIA.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

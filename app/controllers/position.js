const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Position = require('../models/position');
const logger = require('../helper/logger');

/**
 * @swagger
 * /position:
 *  get:
 *      summary: Get all positions
 *      tags: [Position]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get positions.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getPositions = async (_, response) => {
    try {
        const positions = await Position.findAll();
        return response.status(OK).json(positions);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.POSITIONS.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /position/{position_guid}:
 *  get:
 *      summary: Get position by guid
 *      tags: [Position]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: position_guid
 *            description: GUID of position to return
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
 *              description: Could not get position by guid.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getPosition = async (request, response) => {
    try {
        const position = await Position.find({ guid: request.params.guid });
        response.status(OK).json(position);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.POSITION.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /position:
 *   post:
 *     summary: Add new position
 *     tags: [Position]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Position object that needs to be added
 *         schema:
 *           $ref: '#/definitions/position'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new position.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addPosition = async (request, response) => {
    try {
        const { position, isNewRecord } = await Position.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response
                .status(OK)
                .json(
                    responseBuilder.alreadyExistsCriteria(
                        Constants.TypeNames.POSITION.toLowerCase(),
                        request.body.name
                    )
                );
        }
        return response.status(CREATED).json({ position });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.POSITION.toLowerCase(),
                    request.body.name
                )
            );
    }
};

/**
 * @swagger
 * /position/{position_guid}:
 *  put:
 *      summary: Update position by guid
 *      tags: [Position]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: position_guid
 *            required: true
 *          - in: body
 *            name: body
 *            description: Position object that needs to be updated
 *            schema:
 *              $ref: '#/definitions/position'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not update position.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updatePosition = async (request, response) => {
    try {
        await Position.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.POSITION.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /position/{position_guid}:
 *  delete:
 *      summary: Delete position by guid
 *      tags: [Position]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: position_guid
 *            description: Position guid to delete
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
 *              description: Could not delete position.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deletePosition = async (request, response) => {
    try {
        await Position.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.POSITION.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

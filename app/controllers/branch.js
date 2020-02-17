const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const { Constants } = require('../constants/Constants');
const Branch = require('../models/branch');
const logger = require('../helper/logger');

/**
 * @swagger
 * /branch:
 *  get:
 *      description: Get all branches
 *      tags: [Branch]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get users.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getBranches = async (request, response) => {
    try {
        const branches = await Branch.findAll();
        return response.status(OK).json(branches);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.BRANCHES.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /branch/{branch_guid}:
 *  get:
 *      description: Get branch by guid.
 *      tags: [Branch]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: branch_guid
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
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getBranch = async (request, response) => {
    try {
        const branch = await Branch.find({ guid: request.params.guid });
        response.status(OK).json(branch);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.BRANCH.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /branch:
 *   post:
 *     description: Add new branch
 *     tags: [Branch]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: branch name
 *         description: Enter new branch name.
 *         schema:
 *           $ref: '#/definitions/branch'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new branch.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addBranch = async (request, response) => {
    try {
        const { branch, isNewRecord } = await Branch.findOrCreate({
            name: request.body.name,
        });
        if (!isNewRecord) {
            return response
                .status(OK)
                .json(
                    responseBuilder.alreadyExistsCriteria(
                        Constants.TypeNames.BRANCH.toLowerCase(),
                        request.body.name
                    )
                );
        }
        return response.status(CREATED).json({ branch });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.BRANCH.toLowerCase(),
                    request.body.name
                )
            );
    }
};

/**
 * @swagger
 * /branch/{branch_guid}:
 *  put:
 *      description: Update branch by guid.
 *      tags: [Branch]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: branch_guid
 *            required: true
 *          - in: body
 *            name: branch name
 *            description: Update branch name.
 *            schema:
 *              $ref: '#/definitions/branch'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateBranch = async (request, response) => {
    try {
        await Branch.update(request.body, { guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.BRANCH.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /branch/{branch_guid}:
 *  delete:
 *      description: Delete branch by guid.
 *      tags: [Branch]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: branch_guid
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
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteBranch = async (request, response) => {
    try {
        await Branch.delete({ guid: request.params.guid });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.BRANCH.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

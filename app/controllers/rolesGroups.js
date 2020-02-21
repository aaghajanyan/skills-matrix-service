const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const { couldNotGetCriteria } = require('../helper/errorResponseBodyBuilder');
const { Constants } = require('../constants/Constants');
const RoleGroup = require('../models/rolesGroups');
const logger = require('../helper/logger');

/**
 * @swagger
 * /role_group/{role_group_guid}:
 *  get:
 *      summary: Get roule group by guid
 *      tags: [Role group]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: role_group_guid
 *            description: GUID of role group to return
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
 *              description: Could not get role group by guid.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getRoleGroup = async (request, response) => {
    try {
        const roleGroup = await RoleGroup.find({ guid: request.params.guid });
        return response.status(OK).json(roleGroup);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                couldNotGetCriteria(
                    Constants.TypeNames.ROLE_GROUP.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /role_group:
 *  get:
 *      summary: Get all roles groups
 *      tags: [Role group]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get roles groups.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getRoleGroups = async (request, response) => {
    try {
        const roleGroup = await RoleGroup.findAll();
        response.status(OK).json(roleGroup);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                couldNotGetCriteria(
                    Constants.TypeNames.ROLE_GROUPS.toLowerCase()
                )
            );
    }
};

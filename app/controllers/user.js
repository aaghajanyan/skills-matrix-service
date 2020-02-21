const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const {
    OK,
    ACCEPTED,
    CREATED,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    UNAUTHORIZED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const loginSecretKey = require('../../config/env-settings.json').loginSecretKey;
const invitationSecretToken = require('../../config/env-settings.json')
    .invitationSecretKey;
const User = require('../models/user');
const Invitation = require('../models/invitation');
const logger = require('../helper/logger');

/**
 * @swagger
 * /users:
 *  get:
 *      description: Get all users
 *      tags: [User]
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
module.exports.getUsers = async (_, response) => {
    try {
        const users = await User.getUsers();
        return response.status(OK).json(users);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.USERS.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /users/{user_id}:
 *  get:
 *      description: Get all users
 *      tags: [User]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: user_id
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
 *              description: Could not get users.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getUser = async (request, response) => {
    try {
        const user = await User.getByGuid(request.params.userGuid);
        return response.status(OK).json(user);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.USER.toLowerCase(),
                    request.params.userGuid
                )
            );
    }
};

module.exports.updateUser = async (request, response) => {
    try {
        await User.update(request.params.userGuid, request.body);
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.USER.toLowerCase(),
                    request.params.userGuid
                )
            );
    }
};

module.exports.signUp = async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, invitationSecretToken);
        const invitation = await Invitation.findByPk(decodedToken.guid);
        if (!invitation) {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.INVITATION.toLowerCase(),
                        decodedToken.guid
                    )
                );
        }
        request.body.email = invitation.email;
        request.body[Constants.Controllers.Users.guid] = invitation.id;
        request.body[Constants.Controllers.Users.invitationId] =
            decodedToken.guid;
        const user = await User.create(request.body);
        await invitation.destroy();
        response.status(CREATED).json({ guid: user.guid });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.addErrorMsg(
                    Constants.Controllers.Users.COULD_NOT_REGISTER_USER
                )
            );
    }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     description: Login to the application
 *     tags: [Login]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: login body
 *         description: Login the user to the system.
 *         schema:
 *           $ref: '#/definitions/login'
 *
 *     responses:
 *       200:
 *        description: OK
 *       401:
 *         description: Username or password is incorrect.
 *       500:
 *         description: Could not make login.
 *
 */
module.exports.login = async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });

        if (!user) {
            return response
                .status(UNAUTHORIZED)
                .json(
                    responseBuilder.addErrorMsg(
                        Constants.ModelErrors.USERNAME_OR_PASSWORD_IS_INCORRECT
                    )
                );
        }
        const validPassword = bcrypt.compareSync(
            request.body.password,
            user.password
        );
        if (!validPassword) {
            return response
                .status(UNAUTHORIZED)
                .json(
                    responseBuilder.internalServerError(
                        Constants.ModelErrors.USERNAME_OR_PASSWORD_IS_INCORRECT
                    )
                );
        }
        const token = jwt.sign(
            {
                guid: user.guid,
                email: user.email,
                is_active: user.is_active,
                role_group_id: user.role_group_id,
                created_date: user.created_date,
            },
            loginSecretKey,
            { expiresIn: Constants.LOGIN_TOKEN_EXPiRE_DATE }
        );
        return response.header(Constants.AUTHORIZATION, token).json({
            success: true,
            [Constants.TOKEN]: token,
            [Constants.Controllers.Users.guid]: user.guid,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.internalServerError(
                    Constants.Controllers.Users.COULD_NOT_LOGIN
                )
            );
    }
};

module.exports.getCurrentUser = async (request, response) => {
    try {
        const token = request.header("Authorization").split('Bearer ')[1];
        const user = await User.getByGuid(jwt.decode(token).guid);
        response.status(200).json(user);
    } catch (err) {
        response.status(404).send("User is not found");
    }
};
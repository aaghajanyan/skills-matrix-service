
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const {OK, ACCEPTED, CREATED, INTERNAL_SERVER_ERROR, CONFLICT, UNAUTHORIZED, NOT_FOUND} = require('http-status-codes');
const {Constants} = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const loginSecretKey = require('../../config/env-settings.json').loginSecretKey;
const invitationSecretToken = require('../../config/env-settings.json').invitationSecretKey;
const User = require('../models/user');
const Invitation = require('../models/invitation');
const logger = require('../helper/logger');

module.exports.getUsers = async (_, response) => {
    try {
        const users = await User.getUsers();
        return response.status(OK).json(users);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.USERS.toLowerCase()));
    }
};

module.exports.getUser = async (request, response) => {
    try {
        const user = await User.getByGuid(request.params.userGuid);
        return response.status(OK).json(user);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotGetCriteria(Constants.TypeNames.USER.toLowerCase(), request.params.userGuid));
    }
};

module.exports.updateUser = async (request, response) => {
    try {
        await User.update(request.params.userGuid, request.body);
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.couldNotUpdateCriteria(Constants.TypeNames.USER.toLowerCase(), request.params.userGuid));
    }
};

module.exports.signUp = async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, invitationSecretToken);
        const invitation = await Invitation.findByPk(decodedToken.guid);
        if (!invitation) {
            return response.status(CONFLICT).json(responseBuilder.doesNotExistCriteria(Constants.TypeNames.INVITATION.toLowerCase(), decodedToken.guid));
        }
        request.body.email = invitation.email;
        request.body[Constants.Controllers.Users.guid] = invitation.id;
        request.body[Constants.Controllers.Users.invitationId] = decodedToken.guid;
        const user = await User.create(request.body);
        await invitation.destroy();
        response.status(CREATED).json({ guid: user.guid });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.addErrorMsg(Constants.Controllers.Users.COULD_NOT_REGISTER_USER));
    }
};

module.exports.login = async (request, response) => {
    try {
        const user = await User.findOne({ email: request.body.email });

        if (!user) {
            return response.status(UNAUTHORIZED).json(responseBuilder.internalServerError(Constants.ModelErrors.USERNAME_OR_PASSWORD_IS_INCORRECT));
        }
        const validPassword = bcrypt.compareSync(request.body.password, user.password);
        if (!validPassword) {
            return response.status(UNAUTHORIZED).json(responseBuilder.internalServerError(Constants.ModelErrors.USERNAME_OR_PASSWORD_IS_INCORRECT));
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
        return response.status(INTERNAL_SERVER_ERROR).json(responseBuilder.internalServerError(Constants.Controllers.Users.COULD_NOT_LOGIN));
    }
};

module.exports.getCurrentUser = async (request, response) => {
    try {
        const token = request.header(Constants.AUTHORIZATION).split(Constants.BEARER)[1];
        const user = await User.getByGuid(jwt.decode(token).guid);
        response.status(OK).json(user)
    } catch (err) {
        response.status(NOT_FOUND).send(Constants.Controllers.Users.USER_NOT_FOUND);
    }
};

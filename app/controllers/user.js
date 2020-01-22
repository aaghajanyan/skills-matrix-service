const loginSecretKey = require('../../config/env-settings.json').loginSecretKey;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const invitationSecretToken = require('../../config/env-settings.json')
    .invitationSecretKey;
const {
    OK,
    ACCEPTED,
    CREATED,
    INTERNAL_SERVER_ERROR,
    BAD_REQUEST,
    CONFLICT
} = require('http-status-codes');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const { Constants } = require('../constants/Constants');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getUsers = async function(_, response) {
    try {
        const users = await User.getUsers();
        return response.status(OK).json(users);
    } catch (error) {
        logger.error(error);
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.USER.toLowerCase()
            )}`,
        });
    }
};

const getUser = async function(request, response) {
    try {
        const user = await User.getByGuid(request.params.guid);
        return response.status(OK).json(user);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.USER.toLowerCase()
            )}`,
        });
    }
};

const updateUser = async function(request, response) {
    try {
        await User.update(request.params.guid, request.body);
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_UPDATE,
                Constants.TypeNames.USER.toLowerCase()
            )}`,
        });
    }
};

const signUp = async function(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, invitationSecretToken);
        const invitation = await Invitation.findByPk(decodedToken.guid);
        if (!invitation) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.TypeNames.INVITATION
                )}`,
            });
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
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_REGISTER_USER}`,
        });
    }
};

const login = async function(request, response) {
    try {
        const user = await User.findOne({ email: request.body.email });
        if (!user) {
            return response.status(BAD_REQUEST).json({
                success: false,
                message:
                    Constants.ModelErrors.USERNAME_OR_PASSWORD_IS_INCORRECT,
            });
        }
        const validPassword = bcrypt.compareSync(
            request.body.password,
            user.password
        );
        if (!validPassword) {
            return response.status(BAD_REQUEST).json({
                success: false,
                message:
                    Constants.ModelErrors.USERNAME_OR_PASSWORD_IS_INCORRECT,
            });
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
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_LOGIN}`,
        });
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    signUp,
    login,
};

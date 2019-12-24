const {
    invitation: invitationModel,
} = require("../sequelize/models");
const tokenSecret = require('../../config/secretKey.json').token_secret;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const invitationTokenSecret = require('../../config/invitationSecretKey.json').token_secret;
const { OK, ACCEPTED, CREATED, INTERNAL_SERVER_ERROR, BAD_REQUEST, getStatusText } = require('http-status-codes');
const User = require("../models/user");
const { Constants } = require('../constants/Constants');

const getUsers = async function(_, response) {
    try {
        const users = await User.getUsers();
        response.status(OK).json(users);
    } catch(err) {
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_GET_USER} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const getUser = async function(request, response) {
    try {
        const user = await User.getByGuid(request.params.guid);
        response.status(OK).json(user);
    } catch(err) {
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_GET_USER} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const updateUser = async function(request, response) {
    try {
        await User.update(request.params.guid, request.body);
        return response.status(ACCEPTED).json({success: true});
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_UPDATE_USER} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const signUp = async function(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, invitationTokenSecret);
        const invitation = await invitationModel.findByPk(decodedToken.guid);

        if (!invitation) {
            return response.status(BAD_REQUEST).json({
                success: false,
                message: getStatusText(BAD_REQUEST)
            });
        }
        request.body.email = invitation.email;
        request.body[Constants.Controllers.Users.guid] = invitation.id;
        request.body[Constants.Controllers.Users.invitationId] = decodedToken.guid;
        const user = await User.create(request.body);
        await invitation.destroy();
        response.status(CREATED).json({ guid: user.guid })
    } catch(err) {
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_REGISTER_USER} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const login = async function(request, response) {
    try {
        const user = await User.findOneUser({ email: request.body.email });
        if(!user) {
            return response.status(BAD_REQUEST).json({
                success: false,
                message: getStatusText(BAD_REQUEST)
            });
        }
        const validPassword = bcrypt.compareSync(request.body.password, user.password);
        if(!validPassword) {
            return response.status(BAD_REQUEST).json({
                success: false,
                message: getStatusText(BAD_REQUEST)
            });
        }
        const token = jwt.sign(
            {
                guid: user.guid,
                email: user.email,
                isActive: user.isActive,
                roleGroupId: user.roleGroupId,
                createdDate: user.createdDate
            },
            tokenSecret,
            { expiresIn: Constants.LOGIN_TOKEN_EXPiRE_DATE }
        );
        return response.header(Constants.AUTHORIZATION, token).json({
            success: true,
            [Constants.TOKEN]: token,
            [Constants.Controllers.Users.guid]: user.guid
        });
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Users.COULD_NOT_LOGIN} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    signUp,
    login,
};

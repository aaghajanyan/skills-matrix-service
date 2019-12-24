const {
    user: userModel,
    invitation: invitationModel,
} = require("../sequelize/models");
const User = require("../models/user");
const tokenSecret = require('../../config/secretKey.json').token_secret;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const invitationTokenSecret = require('../../config/invitationSecretKey.json').token_secret;
const  Messages = require('../constants/Messages');


const getUsers = async function(_, response) {
    try {
        const users = await User.getUsers();
        response.status(200).json(users);
    } catch(err) {
        response.status(400).json({
            success: false,
            message: 'Could not get users.'
        });
    }
};

const getUser = async function(request, response) {
    try {
        const user = await User.getByGuid(request.params.guid);
        response.status(200).json(user);
    } catch(err) {
        response.status(400).json({
            success: false,
            message: Messages.get('Users.errors.getUser')
        });
    }
};

const updateUser = async function(request, response) {
    try {
        await User.update(request.params.guid, request.body);
        return response.status(202).json({success: true});
    } catch(err) {
        return response.status(400).json({
            success: false,
            message: Messages.get('Users.errors.updateUser')
        });
    }
};

const signUp = async function(request, response) {
    try {
        const token = request.params.token;
        const decodedToken = await jwtDecode(token, invitationTokenSecret);
        const invitation = await invitationModel.findByPk(decodedToken.guid);

        if (!invitation) {
            return response.status(400).send(Messages.get("Users.errors.invitation"));
        }
        request.body.email = invitation.email;
        request.body["guid"] = invitation.id;
        request.body["invitationId"] = decodedToken.guid;
        const user = await User.create(request.body);
        await invitation.destroy();
        response.status(201).json({ guid: user.guid })
    } catch(err) {
        response.status(400).json({
            success: false,
            message: Messages.get("Users.errors.badRequest")
        });
    }
};

const login = async function(request, response) {
    try {
        const user = await User.findOneUser({ email: request.body.email });
        if(!user) {
            return response.status(400).json({
                success: false,
                message: Messages.get("Users.errors.email")
            });
        }
        const validPassword = bcrypt.compareSync(request.body.password, user.password);
        if(!validPassword) {
            return response.status(400).json({
                success: false,
                message: Messages.get("Users.errors.password")
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
            { expiresIn: '1 d' }
        );
        return response.header('Authorization', token).json({
            success: true,
            'token': token,
            'guid': user.guid
        });
    } catch (err) {
        return response.status(401).json({
            success: false,
            message: Messages.get('Users.errors.unauthorized')
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

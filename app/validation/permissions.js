const jwt = require('jsonwebtoken');
const tokenSecret = require("../../config/env-settings.json").secretKey;
const jwtDecode = require('jwt-decode');
const User = require("../models/user");
const logger = require("../helper/logger");

async function verifyPermissions(request, response, next) {
    try {
        const token = request.header("Authorization").split('Bearer ')[1];
        if(!token) {
            return response.status(401).send("Access denied.");
        }
        const verified = await jwt.verify(token, tokenSecret);
        const decodedToken = await jwtDecode(token, tokenSecret);
        const currUser = await User.getByGuid(decodedToken.guid).then(user => {
            return user;
        });
        if (currUser.roleGroup.name != 'super_user') {
            return response.status(401).send({
                success: false,
                message:"Access denied. Need admin permissions."
            });
        }
        request.user = verified;
        next();
    } catch (error) {
        logger.error(error, '');
        return response.status(401).send({
            success: false,
            message: "Unauthorized.Access denied"
        });
    }
}

module.exports = { verifyPermissions };
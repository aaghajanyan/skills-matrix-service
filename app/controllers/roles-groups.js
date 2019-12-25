const {
    OK,
    INTERNAL_SERVER_ERROR,
    getStatusText
} = require("http-status-codes");
const { Constants } = require("../constants/Constants");
const RoleGroup = require("../models/roles-groups");

const getRoleGroup = async function(requesfind, response) {
    try {
        const roleGroup = await RoleGroup.find({ guid: request.params.guid });
        return response.status(OK).json(roleGroup);
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.RolesGroup.COULD_NOT_GET_ROLE_GROUP_F,
                request.params.guid
            )}`
        });
    }
};

const getRoleGroups = async function(request, response) {
    try {
        const roleGroup = await RoleGroup.findAll();
        response.status(OK).json(roleGroup);
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.ROLE_GROUP.toLowerCase()
            )}`
        });
    }
};

module.exports = {
    getRoleGroup,
    getRoleGroups
};

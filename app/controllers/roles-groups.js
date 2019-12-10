const {
    "roles_groups": rolesGroupsModel
} = require("../sequelize/models");

const getRoleGroup = async function(request, response) {
    try {
        const roleGroup = await rolesGroupsModel.findOne({where: {guid: request.params.guid}});
        response.status(200).json(roleGroup); 
    } catch {
        return response.status(409).send({
            success: false,
            message: `Could not get role group with ${request.params.guid} guid.`
        });
    }
}

const getRoleGroups = async function(request, response) {
    try {
        const roleGroup = await rolesGroupsModel.findAll();
        response.status(200).json(roleGroup); 
    } catch {
        return response.status(409).send({
            success: false,
            message: `Could not get roles groups.`
        });
    }

}

module.exports = {
    getRoleGroup,
    getRoleGroups
}
const config = require("../config/config");
const logger = require("../../helper/logger");

class DefaultRoles {

    static async initializeRoleTable(models) {
        let rolesObjArr = await config.roles.map((role) => { return {name: role}});
        await models.roles.bulkCreate(rolesObjArr).catch((err) => {});
    }

    static async initializeRolesGroupsTable(models) {
        let rolesGroupsObjArr = config.rolesGroups.map((roleGroup) => {return {name: roleGroup }} );
        await models.roles_groups.bulkCreate(rolesGroupsObjArr).catch((err) => {});
    }

    static async initializeRolesRelationTable(models, rolesAndGroupRelation) {
        let roleRelList = [];
        Object.keys(rolesAndGroupRelation).map(async function(group) {
            try {
                const rolesList = rolesAndGroupRelation[group];
                const existingRoleGroup = await models.roles_groups.findOne({
                    where: { name: group }
                });
                await rolesList.forEach(async function(role) {
                    try {
                        const existingRole = await models.roles.findOne({
                            where: { name: role }
                        });
                        const currRoleRelObj = {};
                        currRoleRelObj.roleId = existingRole.dataValues.id;
                        currRoleRelObj.roleGroupId =
                            existingRoleGroup.dataValues.id;
                        roleRelList.push(currRoleRelObj);
                        const existingRoleRel = await models.roles_relations.findOne(
                            {
                                where: {
                                    roleId: existingRole.dataValues.id,
                                    roleGroupId: existingRoleGroup.dataValues.id
                                }
                            }
                        );
                        if (!existingRoleRel) {
                            models.roles_relations.build({
                                roleId: existingRole.dataValues.id,
                                roleGroupId: existingRoleGroup.dataValues.id
                            }).save();
                        }
                    } catch(error) {
                        logger.error(error, '');
                    }
                });
            } catch (error) {
                logger.error(error, '');
            }
        });
    }
}

module.exports = DefaultRoles;

const { roles_groups: rolesGroupsModel } = require("../sequelize/models");

class RoleGroup {
    static async findAll() {
        const roleGroups = await rolesGroupsModel.findAll();
        return roleGroups;
    }

    static async find(condition) {
        const roleGroup = await rolesGroupsModel.findOne({
            where: { ...condition }
        });
        return roleGroup;
    }

    static async findByPk(pk) {
        const roleGroup = await rolesGroupsModel.findByPk(pk);
        return roleGroup;
    }

    static async delete(condition) {
        await rolesGroupsModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        await rolesGroupsModel.create(data);
    }
}

module.exports = RoleGroup;

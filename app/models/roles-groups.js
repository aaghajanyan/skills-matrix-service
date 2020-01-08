const { roles_groups: rolesGroupsModel } = require("../sequelize/models");

class RoleGroup {
    static async findAll() {
        return await rolesGroupsModel.findAll();
    }

    static async find(condition) {
        return await rolesGroupsModel.findOne({
            where: { ...condition }
        });
    }

    static async findByPk(pk) {
        return await rolesGroupsModel.findByPk(pk);
    }

    static async delete(condition) {
        await rolesGroupsModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        return await rolesGroupsModel.create(data);
    }
}

module.exports = RoleGroup;

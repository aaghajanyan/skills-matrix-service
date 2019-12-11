const {
    user: userModel,
    roles: rolesModel,
    "roles_relations": rolesRelationModel,
    "roles_groups": rolesGroupsModel
} = require("../sequelize/models");
const bcrypt = require("bcrypt");


class User {
    static async getByGuid(guid) {
        const user = await userModel.findOne({
            where: { guid: guid } ,
            attributes: { exclude: ['password', 'roleGroupId'] } ,
            include: {
                model: rolesGroupsModel,
                as: "roleGroup",
                required: false,
                include: {
                    model: rolesModel,
                    as: "roles",
                    attributes: ["name"],
                    required: false,
                    through: {
                        model: rolesRelationModel,
                        as: "roleRelation",
                        attributes: []
                    }
                }
            }
        });
        return user;
    }

    static async create(data) {
        const salt = await bcrypt.genSalt(10);
        data.password = bcrypt.hashSync(data.password, salt);
        return userModel.create(data);
    }

    static async update(guid, data) {
        const salt = await bcrypt.genSalt(10);
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, salt);
        }
        return userModel.update(data, { where: { guid: guid } });
    }
}

module.exports = User;

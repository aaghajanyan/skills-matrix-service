const {
    user: userModel,
    roles: rolesModel,
    roles_relations: rolesRelationModel,
    roles_groups: rolesGroupsModel,
    users_skills: userSkillsModel,
    skill: skillModel,
    category: cateoryModel,
    skills_relation: skillsRelationModel
} = require("../sequelize/models");
const bcrypt = require("bcrypt");

class User {
    static async getByGuid(guid) {
        const user = await userModel.findOne({
            where: { guid: guid },
            attributes: { exclude: ["password", "roleGroupId"] },
            include: [
                {
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
                },
                {
                    attributes: { exclude: ["id"] },
                    model: skillModel,
                    as: "skills",
                    required: false,
                    through: {
                        model: userSkillsModel,
                        as: "skillMark",
                        attributes: ["currentMark", "experience", "profficience", "guid"]
                    },
                    include: {
                        model: cateoryModel,
                        as: "categories",
                        attributes: ["name", "guid"],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: "skillsRelationModel",
                            attributes: []
                        }
                    }
                }
            ]
        });
        return user;
    }

    static async getUsers() {
        const users = await userModel.findAll({
            attributes: { exclude: ["id", "password", "roleGroupId"] },
            include: [
                {
                    attributes: { exclude: ["id"] },
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
                },
                {
                    attributes: { exclude: ["id"] },
                    model: skillModel,
                    as: "skills",
                    required: false,
                    through: {
                        model: userSkillsModel,
                        as: "skillMark",
                        attributes: ["currentMark", "experience", "profficience", "guid"]
                    },
                    include: {
                        model: cateoryModel,
                        as: "categories",
                        attributes: ["name", "guid"],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: "skillsRelationModel",
                            attributes: []
                        }
                    }
                }
            ]
        });
        return users;
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

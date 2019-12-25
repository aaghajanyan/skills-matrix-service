const { users_skills: usersSkillsModel } = require("../sequelize/models");

class UserSkill {
    static async findAll() {
        const userSkills = await usersSkillsModel.findAll();
        return userSkills;
    }

    static async find(condition) {
        const userSkill = await usersSkillsModel.findOne({
            where: { ...condition }
        });
        return userSkill;
    }

    static async findByPk(pk) {
        const userSkill = await usersSkillsModel.findByPk(pk);
        return userSkill;
    }

    static async delete(condition) {
        await usersSkillsModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        return await usersSkillsModel.create(data);
    }

    static async update(data, condition) {
        await usersSkillsModel.update(data, { where: { ...condition } });
    }
}

module.exports = UserSkill;

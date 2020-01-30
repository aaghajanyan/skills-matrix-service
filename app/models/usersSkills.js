const {users_skills: usersSkillsModel} = require('../sequelize/models');

class UserSkill {
    static async findAll() {
        return await usersSkillsModel.findAll();
    }

    static async find(condition) {
        return await usersSkillsModel.findOne({
            where: {...condition}
        });
    }

    static async findByPk(pk) {
        return await usersSkillsModel.findByPk(pk);
    }

    static async delete(condition) {
        await usersSkillsModel.destroy({where: {...condition}});
    }
    static async create(data) {
        return await usersSkillsModel.create(data);
    }

    static async update(data, condition) {
        await usersSkillsModel.update(data, {where: {...condition}});
    }
}

module.exports = UserSkill;

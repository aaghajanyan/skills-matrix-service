const {skill_history: skillHistoryModel} = require('../sequelize/models');

class SkillHistory {
    static async findAll() {
        return await skillHistoryModel.findAll();
    }

    static async find(condition) {
        return await skillHistoryModel.findOne({
            where: {...condition}
        });
    }

    static async findByPk(pk) {
        return await skillHistoryModel.findByPk(pk);
    }

    static async delete(condition) {
        await skillHistoryModel.destroy({where: {...condition}});
    }
    static async create(data) {
        return await skillHistoryModel.create(data);
    }

    static async update(data, condition) {
        await skillHistoryModel.update(data, {where: {...condition}});
    }

    static async findOrCreate(data, condition) {
        const skillHistoryData = await SkillHistory.find(condition);
        if(!skillHistoryData) {
            return await SkillHistory.create(data);
        }
        return skillHistoryData;
    }
}

module.exports = SkillHistory;

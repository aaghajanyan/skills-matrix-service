const { skills_relation: skillRelationModel } = require('../sequelize/models');

class SkillRelation {
    static async findAll() {
        return await skillRelationModel.findAll();
    }

    static async find(condition) {
        return await skillRelationModel.findOne({
            where: { ...condition },
        });
    }

    static async findByPk(pk) {
        return await skillRelationModel.findByPk(pk);
    }

    static async delete(condition) {
        await skillRelationModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        return await skillRelationModel.create(data);
    }

    static async update(data) {
        await skillRelationModel.update(data, { where: { ...condition } });
    }
}

module.exports = SkillRelation;

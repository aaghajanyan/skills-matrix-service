const { skills_relation: skillRelationModel } = require("../sequelize/models");

class SkillRelation {
    static async findAll() {
        const skillRelations = await skillRelationModel.findAll();
        return skillRelations;
    }

    static async find(condition) {
        const skillRelation = await skillRelationModel.findOne({
            where: { ...condition }
        });
        return skillRelation;
    }

    static async findByPk(pk) {
        const skillRelation = await skillRelationModel.findByPk(pk);
        return skillRelation;
    }

    static async delete(condition) {
        await skillRelationModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        await skillRelationModel.create(data);
    }

    static async update(data) {
        await skillRelationModel.update(data, { where: { ...condition } });
    }
}

module.exports = SkillRelation;

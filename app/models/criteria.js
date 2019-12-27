const { criteria: criteriaModel } = require("../sequelize/models");

class Criteria {
    static async findAll() {
        const criteries = await criteriaModel.findAll();
        return criteries;
    }

    static async find(condition) {
        const criteria = await criteriaModel.findOne({
            where: { ...condition }
        });
        return criteria;
    }

    static async findByPk(pk) {
        const criteria = await criteriaModel.findByPk(pk);
        return criteria;
    }

    static async delete(condition) {
        await criteriaModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        const criteria = await criteriaModel.create(data);
        return criteria;
    }

    static async findOrCreate(condition) {
        const criteria = await criteriaModel.findOrCreate({
            where: { ...condition }
        });
        return {
            criteria: criteria[0],
            isNewRecord: criteria[1]
        };
    }
}

module.exports = Criteria;

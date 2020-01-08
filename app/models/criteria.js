const { criteria: criteriaModel } = require("../sequelize/models");

class Criteria {
    static async findAll() {
        return await criteriaModel.findAll();
    }

    static async find(condition) {
        return await criteriaModel.findOne({
            where: { ...condition }
        });
    }

    static async findByPk(pk) {
        return await criteriaModel.findByPk(pk);
    }

    static async delete(condition) {
        await criteriaModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        return await criteriaModel.create(data);
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

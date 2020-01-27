const {categories_relation: categoryRelationModel} = require('../sequelize/models');

class CategoryRelation {
    static async findAll() {
        return await categoryRelationModel.findAll();
    }

    static async find(condition) {
        return await categoryRelationModel.findOne({
            where: { ...condition },
        });
    }

    static async findByPk(pk) {
        return await categoryRelationModel.findByPk(pk);
    }

    static async update(data, condition) {
        await categoryRelationModel.update(data, { where: { ...condition } });
    }

    static async delete(condition) {
        await categoryRelationModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        return await categoryRelationModel.create(data);
    }
}

module.exports = CategoryRelation;

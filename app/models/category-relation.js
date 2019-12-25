const {
    categories_relation: categoryRelationModel,
    skills_relation: skillRelationModel
} = require("../sequelize/models");

class CategoryRelation {
    static async findAll() {
        const categoryRelations = await categoryRelationModel.findAll();
        return categoryRelations;
    }

    static async find(condition) {
        const categoryRelations = await categoryRelationModel.findOne({
            where: { ...condition }
        });
        return categoryRelations;
    }

    static async findByPk(pk) {
        const categoryRelation = await categoryRelationModel.findByPk(pk);
        return categoryRelation;
    }

    static async update(data, condition) {
        await categoryRelationModel.update(data, { where: { ...condition } });
    }

    static async delete(condition) {
        await categoryRelationModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        await categoryRelationModel.create(data);
    }
}

module.exports = CategoryRelation;

const {category_history: categoryHistoryModel} = require('../sequelize/models');

class CategoryHistory {
    static async findAll() {
        return await categoryHistoryModel.findAll();
    }

    static async findByUserId(UserId) {
        const history = await categoryHistoryModel.findAll({
            where: { user_id : UserId }});
        return history;
    }

    static async find(condition) {
        return await categoryHistoryModel.findAll({
            where: { ...condition },
        });
    }

    static async findByPk(pk) {
        return await categoryHistoryModel.findByPk(pk);
    }

    static async delete(condition) {
        await categoryHistoryModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        return await categoryHistoryModel.create(data);
    }

    static async update(data, condition) {
        await categoryHistoryModel.update(data, { where: { ...condition } });
    }

    static async findOrCreate(data, condition) {
        const categoryHistoryData = await CategoryHistory.find(condition);
        if (!categoryHistoryData) {
            return await CategoryHistory.create(data);
        }
        return categoryHistoryData;
    }
}

module.exports = CategoryHistory;

const { users_categories: usersCategoriesModel } = require('../sequelize/models');

class UserCategory {
    static async findAll() {
        const userCategories = await usersCategoriesModel.findAll();
        return userCategories;
    }

    static async find(condition) {
        return await usersCategoriesModel.findOne({
            where: { ...condition },
        });
    }

    static async findByPk(id) {
        return await usersCategoriesModel.findByPk(id);
    }

    static async delete(condition) {
        await usersCategoriesModel.destroy({ where: { ...condition } });
    }
    static async create(data) {
        return await usersCategoriesModel.create(data);
    }

    static async update(data, condition) {
        await usersCategoriesModel.update(data, { where: { ...condition } });
    }
}

module.exports = UserCategory;

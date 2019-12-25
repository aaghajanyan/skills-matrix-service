const {
    users_categories: usersCategoriesModel
} = require("../sequelize/models");

class UserCategory {
    static async findAll() {
        const userCategories = await usersCategoriesModel.findAll();
        return userCategories;
    }

    static async find(condition) {
        const userCategory = await usersCategoriesModel.findOne({
            where: { ...condition }
        });
        return userCategory;
    }

    static async findByPk(pk) {
        const userCategory = await usersCategoriesModel.findByPk(pk);
        return userCategory;
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

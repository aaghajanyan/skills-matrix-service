const { branch: branchModel } = require("../sequelize/models");

class Branch {
    static async findAll() {
        return await branchModel.findAll();
    }

    static async find(condition) {
        return await branchModel.findOne({
            where: { ...condition }
        });
    }

    static async findByPk(id) {
        return await branchModel.findByPk(id);
    }

    static async delete(condition) {
        await branchModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        return await branchModel.create(data);
    }

    static async findOrCreate(condition) {
        const branch = await branchModel.findOrCreate({
            where: { ...condition }
        });
        return {
            branch: branch[0],
            isNewRecord: branch[1]
        };
    }
}

module.exports = Branch;

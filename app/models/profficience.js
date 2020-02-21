const {profficiences: profficienceModel} = require('../sequelize/models');

class Profficiences {
    static async findAll() {
        return await profficienceModel.findAll();
    }

    static async update(data, id) {
        await profficienceModel.update(data, { where: { id: id } });
    }

    static async delete(condition) {
        await profficienceModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        return await profficienceModel.create(data);
    }

    static async findOrCreate(condition) {
        const profficience = await profficienceModel.findOrCreate({
            where: { ...condition },
        });
        return {
            profficience: profficience[0],
            isNewRecord: profficience[1],
        };
    }
}

module.exports = Profficiences;
const {profficiences: profficienceModel} = require('../sequelize/models');

class Profficiences {
    static async findAll() {
        return await profficienceModel.findAll();
    }

    static async update(data, id) {
        await profficienceModel.update(data, { where: { id: id } });
    }
}

module.exports = Profficiences;
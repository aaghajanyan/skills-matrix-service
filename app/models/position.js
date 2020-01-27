const {position: positionModel} = require('../sequelize/models');

class Position {
    static async findAll() {
        return await positionModel.findAll();
    }

    static async find(condition) {
        return await positionModel.findOne({
            where: { ...condition },
        });
    }

    static async findByPk(id) {
        return await positionModel.findByPk(id);
    }

    static async delete(condition) {
        await positionModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        return await positionModel.create(data);
    }

    static async update(data, condition) {
        await positionModel.update(data, { where: { ...condition } });
    }

    static async findOrCreate(condition) {
        const position = await positionModel.findOrCreate({
            where: { ...condition },
        });
        return {
            position: position[0],
            isNewRecord: position[1],
        };
    }
}

module.exports = Position;

const {invitation: invitationModel} = require('../sequelize/models');

class Invitation {
    static async findAll() {
        return await invitationModel.findAll();
    }

    static async find(condition) {
        return await invitationModel.findOne({
            where: { ...condition },
        });
    }

    static async findByPk(pk) {
        return await invitationModel.findByPk(pk);
    }

    static async delete(condition) {
        await invitationModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        return await invitationModel.create(data);
    }
}

module.exports = Invitation;

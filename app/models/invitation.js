const { invitation: invitationModel } = require("../sequelize/models");

class Invitation {
    static async findAll() {
        const invitations = await invitationModel.findAll();
        return invitations;
    }

    static async find(condition) {
        const invitation = await invitationModel.findOne({
            where: { ...condition }
        });
        return invitation;
    }

    static async findByPk(pk) {
        const invitation = await invitationModel.findByPk(pk);
        return invitation;
    }

    static async delete(condition) {
        await invitationModel.destroy({ where: { ...condition } });
    }

    static async create(data) {
        const invitation = await invitationModel.create(data);
        return invitation;
    }
}

module.exports = Invitation;

const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const UserSkill = sequelize.define(
        Constants.ModelNames.UsersSkills,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },

            skillId: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            experience: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            profficience: {
                allowNull: false,
                type: DataTypes.INTEGER
            }
        },
        {
            timestamps: false
        }
    );
    UserSkill.associate = models => {};

    return UserSkill;
};

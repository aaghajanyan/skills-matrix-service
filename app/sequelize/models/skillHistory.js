const { Constants } = require('../../constants/Constants');
const config = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    const SkillHistory = sequelize.define(
        Constants.ModelNames.SkillHistory,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },

            skill_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            experience: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            profficience: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            last_worked_date: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            created_date: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            operation: {
                type: DataTypes.ENUM,
                values: config.operations,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );
    SkillHistory.associate = models => {};

    return SkillHistory;
};

const { Constants } = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const CategoryHistory = sequelize.define(
        Constants.ModelNames.CategoryHistory,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },

            category_id: {
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
            }
        },
        {
            timestamps: false,
        }
    );
    CategoryHistory.associate = models => {};

    return CategoryHistory;
};

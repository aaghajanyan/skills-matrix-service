const { Constants } = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const UserCategory = sequelize.define(
        Constants.ModelNames.UsersCategories,
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
        },
        {
            timestamps: false,
        }
    );
    UserCategory.associate = models => {};

    return UserCategory;
};

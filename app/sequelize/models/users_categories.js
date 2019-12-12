module.exports = (sequelize, DataTypes) => {
    const UserCategory = sequelize.define(
        "users_categories",
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                allowNull: false,
                type: DataTypes.UUID,
            },

            categoryId: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            experience: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            profficience: {
                allowNull: false,
                type: DataTypes.ENUM(
                    "Juniore",
                    "Mid 1",
                    "Mid 2",
                    "Senior"
                )
            }
        },
        {
            timestamps: false
        }
    );
    UserCategory.associate = models => {};

    return UserCategory;
};

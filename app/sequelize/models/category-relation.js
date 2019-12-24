const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const CategoryRelation = sequelize.define(
        Constants.ModelNames.CategoriesRelation,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.CategoryIdMissing
                }
            },
            relatedCategoryId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.RelatedCategoryIdMissing
                }
            }
        },
        {
            timestamps: false
        }
    );
    CategoryRelation.associate = models => {};
    return CategoryRelation;
};
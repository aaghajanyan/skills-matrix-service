const {Constants} = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const CategoryRelation = sequelize.define(
        Constants.ModelNames.CategoriesRelation,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.CATEGORY_ID_IS_MISSING
                }
            },
            related_category_id: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.RELATED_CATEGORY_ID_IS_MISSING
                }
            }
        },
        {
            timestamps: false
        }
    );

    return CategoryRelation;
};

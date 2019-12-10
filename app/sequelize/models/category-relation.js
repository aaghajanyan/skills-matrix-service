module.exports = (sequelize, DataTypes) => {
    const CategoryRelation = sequelize.define(
        "categories_relation",
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: "Please enter category id"
                }
            },
            relatedCategoryId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: "Please enter related category id"
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
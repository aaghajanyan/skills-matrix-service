module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        "category",
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: "Please enter name"
                },
                unique: {
                    args: true,
                    msg: "Category already exists"
                }
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            timestamps: false
        }
    );
    Category.associate = models => {
        Category.belongsToMany(models.category, {
            through: "categories_relations",
            as: "relatedCategories",
            foreignKey: "relatedCategoryId",
            otherKey: "categoryId",
            timestamps: false
        })
        Category.belongsToMany(models.category, {
            through: "categories_relations",
            as: "relatedCategoriesRef",
            foreignKey: "categoryId",
            otherKey: "relatedCategoryId",
            timestamps: false
        })
        Category.belongsToMany(models.skill, {
            through: "skills_relations",
            as: "skills",
            foreignKey: "categoryId",
            otherKey: "skillId",
            timestamps: false
        });
    };
    return Category;
};
const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
        Constants.ModelNames.Category,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.CATEGORY_ALREADY_EXITS
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
            through: Constants.TableNames.CategoriesRelations,
            as: Constants.Associate.Aliases.relatedCategories,
            foreignKey: Constants.Keys.relatedCategoryId,
            otherKey: Constants.Keys.categoryId,
            timestamps: false
        })
        Category.belongsToMany(models.category, {
            through: Constants.TableNames.CategoriesRelations,
            as: Constants.Associate.Aliases.relatedCategoriesRef,
            foreignKey: Constants.Keys.categoryId,
            otherKey: Constants.Keys.relatedCategoryId,
            timestamps: false
        })
        Category.belongsToMany(models.skill, {
            through: Constants.TableNames.SkillsRelations,
            as: Constants.Associate.Aliases.skills,
            foreignKey: Constants.Keys.categoryId,
            otherKey: Constants.Keys.skillId,
            timestamps: false
        }),
        Category.belongsToMany(models.user, {
            through: Constants.TableNames.UsersCategories,
            as: Constants.Associate.Aliases.categories,
            foreignKey: Constants.Keys.categoryId,
        });
    };
    return Category;
};
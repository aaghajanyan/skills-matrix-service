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
            foreignKey: Constants.Migrations.relatedCategoryId,
            otherKey: Constants.Migrations.categoryId,
            timestamps: false
        })
        Category.belongsToMany(models.category, {
            through: Constants.TableNames.CategoriesRelations,
            as: Constants.Associate.Aliases.relatedCategoriesRef,
            foreignKey: Constants.Migrations.categoryId,
            otherKey: Constants.Migrations.relatedCategoryId,
            timestamps: false
        })
        Category.belongsToMany(models.skill, {
            through: Constants.TableNames.SkillsRelations,
            as: Constants.Associate.Aliases.skills,
            foreignKey: Constants.Migrations.categoryId,
            otherKey: Constants.Migrations.skillId,
            timestamps: false
        }),
        Category.belongsToMany(models.user, {
            through: Constants.TableNames.UsersCategories,
            as: Constants.Associate.Aliases.categories,
            foreignKey: Constants.Migrations.categoryId,
        });
    };
    return Category;
};
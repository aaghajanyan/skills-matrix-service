const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.CategoriesRelations, {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            guid: {
                unique: true,
                allowNull: false,
                type: Sequelize.UUID
            },
            categoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Categories,
                    key: Constants.Keys.id,
                    as: Constants.Keys.categoryId
                }
            },
            relatedCategoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Categories,
                    key: Constants.Keys.id,
                    as: Constants.Keys.CategoryRelation.relatedCategoryId
                }
            }
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.CategoriesRelations)
};

const {Constants} = require('../../constants/Constants');

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
            category_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Categories,
                    key: Constants.Keys.id,
                    as: Constants.Keys.category_id
                }
            },
            related_category_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Categories,
                    key: Constants.Keys.id,
                    as: Constants.Keys.related_category_id
                }
            }
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.CategoriesRelations)
};

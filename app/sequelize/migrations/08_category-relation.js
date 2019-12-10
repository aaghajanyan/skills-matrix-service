module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("categories_relations", {
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
                onDelete: "CASCADE",
                references: {
                    model: "categories",
                    key: "id",
                    as: "categoryId"
                }
            },
            relatedCategoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "categories",
                    key: "id",
                    as: "relatedCategoryId"
                }
            }
        });
    },
    down: queryInterface => queryInterface.dropTable("categories_relations")
};

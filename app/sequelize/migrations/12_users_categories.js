module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("users_categories", {
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
            userId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "users",
                    key: "id",
                    as: "userId"
                }
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
            experience: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            profficience: {
                allowNull: false,
                type: Sequelize.ENUM(
                    "Juniore",
                    "Mid 1",
                    "Mid 2",
                    "Senior"
                )
            }
        }).then(() => queryInterface.addConstraint(
            'users_categories',
            ['userId', 'categoryId'],
            {
                type: 'unique',
                name: 'uniqueUserCategory'
            }));;
    },
    down: queryInterface => queryInterface.dropTable("users_categories")
};

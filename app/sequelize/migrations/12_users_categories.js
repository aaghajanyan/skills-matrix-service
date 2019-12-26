const { Constants } = require("../../constants/Constants");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.UsersCategories, {
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
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Users,
                    key: Constants.Keys.id,
                    as: Constants.Keys.userId
                }
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
            experience: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            profficience: {
                allowNull: false,
                type: Sequelize.INTEGER
            }
        }).then(() => queryInterface.addConstraint(
            Constants.TableNames.UsersCategories,
            [Constants.Keys.userId, Constants.Keys.categoryId],
            {
                type: Constants.Keys.unique,
                name: Constants.Migrations.UsersCategories.uniqueUserCategory
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.UsersCategories)
};

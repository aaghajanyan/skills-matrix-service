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
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.userId
                }
            },
            categoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Categories,
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.categoryId
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
            [Constants.Migrations.userId, Constants.Migrations.categoryId],
            {
                type: Constants.Migrations.unique,
                name: Constants.Migrations.UsersCategories.uniqueUserCategory
            }));
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.UsersCategories)
};

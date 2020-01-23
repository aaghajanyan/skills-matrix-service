const { Constants } = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable(Constants.TableNames.CategoryHistory, {
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                guid: {
                    unique: false,
                    allowNull: false,
                    type: Sequelize.UUID,
                },
                user_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.Users,
                        key: Constants.Keys.id,
                        as: Constants.Keys.user_id,
                    },
                },
                category_id: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                    onDelete: Constants.CASCADE,
                    references: {
                        model: Constants.TableNames.Categories,
                        key: Constants.Keys.id,
                        as: Constants.Keys.category_id,
                    },
                },
                experience: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                profficience: {
                    allowNull: false,
                    type: Sequelize.INTEGER,
                },
                last_worked_date: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                created_date: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            })
            .then(() =>
                queryInterface.addConstraint(
                    Constants.TableNames.CategoryHistory,
                    [Constants.Keys.user_id, Constants.Keys.category_id, Constants.Keys.created_date],
                    {
                        type: Constants.Keys.unique,
                        name:Constants.Migrations.CategoryHistory.uniqueCategoryHistory,
                    }
                )
            );
    },
    down: queryInterface =>
        queryInterface.dropTable(Constants.TableNames.CategoryHistory),
};

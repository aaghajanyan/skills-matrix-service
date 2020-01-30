const {Constants} = require('../../constants/Constants');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(Constants.TableNames.Users, {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                unique: true,
                allowNull: false,
                type: Sequelize.STRING
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            fname: {
                allowNull: false,
                type: Sequelize.STRING
            },
            lname: {
                allowNull: false,
                type: Sequelize.STRING
            },
            branch_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Branches,
                    key: Constants.Keys.id,
                    as: Constants.Keys.branch_id
                }
            },
            guid: {
                unique: true,
                allowNull: false,
                type: Sequelize.UUID
            },
            is_active: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            created_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            started_to_work_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            role_group_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.RolesGroup,
                    key: Constants.Keys.id,
                    as: Constants.Keys.role_group_id
                }
            },
            position_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Positions,
                    key: Constants.Keys.id,
                    as: Constants.Keys.position_id
                }
            }
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Users)
};

const { Constants } = require("../../constants/Constants");

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
            branchId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Branches,
                    key: Constants.Keys.id,
                    as: Constants.Keys.branchId
                }
            },
            guid: {
                unique: true,
                allowNull: false,
                type: Sequelize.UUID
            },
            isActive: {
                allowNull: false,
                type: Sequelize.BOOLEAN
            },
            createdDate: {
                allowNull: false,
                type: Sequelize.DATE
            },
            startedToWorkDate: {
                allowNull: false,
                type: Sequelize.DATE
            },
            roleGroupId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.RolesGroup,
                    key: Constants.Keys.id,
                    as: Constants.Keys.roleGroupId
                }
            },
            positionId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: Constants.CASCADE,
                references: {
                    model: Constants.TableNames.Positions,
                    key: Constants.Keys.id,
                    as: Constants.Keys.positionId
                }
            },
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Users)
};

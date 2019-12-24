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
            branchName: {
                unique: false,
                allowNull: false,
                type: Sequelize.ENUM(
                    "Vanadzor",
                    "Erevan",
                    "Goris"
                )
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
                    key: Constants.Migrations.id,
                    as: Constants.Migrations.roleGroupId
                }
            },
            position: {
                unique: false,
                allowNull: false,
                type: Sequelize.ENUM(
                    "Beginner SW Engineer",
                    "SW Engineer",
                    "Senior SW Engineer",
                    "Beginner QA Tester",
                    "QA Tester",
                    "SQE Analyst",
                    "Sr. Software Quality Engineer",
                    "QA Analyst",
                    "QA lead",
                    "Team lead",
                    "Graphic designer",
                    "technical manager",
                    "Senior Team lead",
                    "Project Manager",
                    "3D modeler",
                    "UIUX designer",
                    "SW Architect"
                )
            }
        });
    },
    down: queryInterface => queryInterface.dropTable(Constants.TableNames.Users)
};

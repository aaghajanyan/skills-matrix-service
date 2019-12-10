module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("users", {
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
                allowNull: false,
                type: Sequelize.STRING
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
                onDelete: "CASCADE",
                references: {
                    model: "roles_groups",
                    key: "id",
                    as: "roleGroupId"
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
    down: queryInterface => queryInterface.dropTable("users")
};

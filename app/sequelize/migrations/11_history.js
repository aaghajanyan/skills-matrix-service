module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("history", {
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
            userSkillId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "users_skills",
                    key: "id",
                    as: "userSkillId"
                }
            },
            value: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            createdDate: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: queryInterface => queryInterface.dropTable("history")
};

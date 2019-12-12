module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("users_skills", {
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
            skillId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "skills",
                    key: "id",
                    as: "skillId"
                }
            },
            currentMark: {
                allowNull: false,
                type: Sequelize.INTEGER
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
            'users_skills',
            ['userId', 'skillId'],
            {
                type: 'unique',
                name: 'uniqueUserSkill'
            }));;
    },
    down: queryInterface => queryInterface.dropTable("users_skills")
};

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("skills_relations", {
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
            skillId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "skills",
                    key: "id",
                    as: "categoryId"
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
            }
        }).then(() => queryInterface.addConstraint(
            'skills_relations', 
            ['skillId', 'categoryId'],
            {
                type: 'unique',
                name: 'uniqueSkillRel'
            }));   
    },
    down: queryInterface => queryInterface.dropTable("skills_relations"),
};
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("roles_relations", {
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
            roleId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "roles",
                    key: "id",
                    as: "roleId"
                }
            }
        }).then(() => queryInterface.addConstraint(
            'roles_relations', 
            ['roleId', 'roleGroupId'],
            {
                type: 'unique',
                name: 'uniqueRoleRel'
            }));
    },
    down: queryInterface => queryInterface.dropTable("roles_relations")
};
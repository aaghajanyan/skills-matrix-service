module.exports = (sequelize, DataTypes) => {
    const CategoryRelation = sequelize.define(
        "skills_relation",
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            skillId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: "Please enter skill id"
                }
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: "Please enter category id"
                }
            }
        },
        {
            timestamps: false
        }
    );
    CategoryRelation.associate = models => {};
    return CategoryRelation;
};
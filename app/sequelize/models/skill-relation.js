const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const CategoryRelation = sequelize.define(
        Constants.ModelNames.SkillsRelations,
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            skillId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.SKILL_ID_IS_MISSING
                }
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.CATEGORY_ID_IS_MISSING
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
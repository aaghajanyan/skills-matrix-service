module.exports = (sequelize, DataTypes) => {
    const UserSkill = sequelize.define(
        "users_skills",
        {
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 3
            },

            skillId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 3
            },
            currentMark: {
                allowNull: false,
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        },
        {
            timestamps: false
        }
    );
    UserSkill.associate = models => {};

    return UserSkill;
};

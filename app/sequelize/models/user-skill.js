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
                type: DataTypes.UUID,
            },

            skillId: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            currentMark: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            experience: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            profficience: {
                allowNull: false,
                type: DataTypes.ENUM(
                    "Juniore",
                    "Mid 1",
                    "Mid 2",
                    "Senior"
                )
            }
        },
        {
            timestamps: false
        }
    );
    UserSkill.associate = models => {};

    return UserSkill;
};

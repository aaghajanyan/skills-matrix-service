const { Constants } = require("../../constants/Constants");

module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define(
        Constants.ModelNames.Skills,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NameMissing
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.SkillAlreadyExists
                }
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
        },
        {
            timestamps: false
        }
    );
    Skill.associate = models => {
        Skill.belongsToMany(models.category, {
            through: Constants.TableNames.SkillsRelations,
            as: Constants.Associate.Aliases.categories,
            foreignKey: Constants.Migrations.skillId,
        }),
        Skill.belongsToMany(models.user, {
            through: Constants.TableNames.UsersSkills,
            as: Constants.Associate.Aliases.skills,
            foreignKey: Constants.Migrations.skillId
        });
    };
    return Skill;
};

const {Constants} = require('../../constants/Constants');

module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define(
        Constants.ModelNames.Skills,
        {
            name: {
                type: DataTypes.STRING,
                allowNull: {
                    args: false,
                    msg: Constants.ModelErrors.NAME_IS_MISSING
                },
                unique: {
                    args: true,
                    msg: Constants.ModelErrors.SKILL_ALREADY_EXISTS
                }
            },
            guid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            }
        },
        {
            timestamps: false
        }
    );
    Skill.associate = models => {
        Skill.belongsToMany(models.category, {
            through: Constants.TableNames.SkillsRelations,
            as: Constants.Associate.Aliases.categories,
            foreignKey: Constants.Keys.skill_id
        });
        Skill.belongsToMany(models.user, {
            through: Constants.TableNames.UsersSkills,
            as: Constants.Associate.Aliases.skills,
            foreignKey: Constants.Keys.skill_id
        });
    };

    return Skill;
};

const {
    user: userModel,
    users_categories: userCategoriesModel,
    skill: skillModel,
    category: categoryModel,
    skills_relation: skillsRelationModel,
    profficiences: profficienceModel
} = require('../sequelize/models');
const {Constants} = require('../constants/Constants');
const User = require('./user');

class DashboardInfo {

    static async topSkillsAndNeedToImprove(guid) {
        const topSkils = [];
        const needToImprove = [];
        const categoriesUsers = [];

        const user = await userModel.findOne({
            where: { guid: guid },
            attributes: {
                exclude: [Constants.Keys.password, Constants.Keys.role_group_id],
            },
            include: [
                {
                    model: skillModel,
                    as: Constants.Associate.Aliases.skills,
                    required: false,
                    include: {
                        model: categoryModel,
                        as: Constants.Associate.Aliases.categories,
                        attributes: [Constants.Keys.name, Constants.Keys.guid],
                        required: false,
                        through: {
                            model: skillsRelationModel,
                            as: Constants.Associate.Aliases.skillsRelationModel,
                            attributes: [],
                        },
                    },
                },
            ],
        });

        const user_categories = await userModel.findOne({
            where: { guid: guid },
            attributes: {
                exclude: [Constants.Keys.password, Constants.Keys.role_group_id],
            },
            include: [
                {
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    through: {
                        model: userCategoriesModel,
                        as: Constants.Associate.Aliases.categoryMark,
                        attributes: [
                            Constants.Controllers.Search.EXPERIENCE,
                            Constants.Controllers.Search.PROFFICIENCE,
                            Constants.Controllers.Search.LAST_WORKED_DATE,
                            Constants.Keys.guid,
                        ],
                    },
                },
            ],
        });

        const profficience = await profficienceModel.findAll();
        user.skills.map(item => {
            if(item.users_skills.dataValues.profficience > 3) {
                const profficienceObj = {}
                profficience.map(score => {
                    if(score.value === item.users_skills.profficience){
                        Object.assign(profficienceObj, {
                            name: score.name,
                            mark: score.value
                        })
                    }
                })
                    const skillsInfo = {
                        guid: item.guid,
                        name: item.name,
                        icon: item.icon,
                        categories: item.categories[0].name,
                        last_worked_date: item.users_skills.last_worked_date,
                        profficience: profficienceObj,
                        experience: item.users_skills.dataValues.experience
                    }
                    topSkils.push(skillsInfo);
            }else if(item.users_skills.dataValues.profficience <= 3){
                    const profficienceObj = {}
                    profficience.map(score => {
                        if(score.value === item.users_skills.profficience){
                            Object.assign(profficienceObj, {
                                name: score.name,
                                mark: score.value
                            })
                        }
                    })
                    const skillsInfo = {
                        guid: item.guid,
                        name: item.name,
                        categories: item.categories[0].name,
                        last_worked_date: item.users_skills.last_worked_date,
                        icon: item.icon,
                        profficience: profficienceObj,
                        experience: item.users_skills.dataValues.experience
                    }
                    needToImprove.push(skillsInfo);
            }
        });

        user_categories.categories.map(cat => {
            const categoriesInfo = {
                name: cat.name,
                average: cat.categoryMark.profficience,
                last_worked_date: cat.categoryMark.last_worked_date
            }
            categoriesUsers.push(categoriesInfo);
        }
        )

        const topSkilsSort = topSkils.sort((a, b) => {
            return b.profficience.mark-a.profficience.mark;
        });

        const needToImproveSort = needToImprove.sort((a, b) => {
            return a.profficience.mark-b.profficience.mark;
        });

        const categoriesUsersSort = categoriesUsers.sort((a, b) => {
            return b.average-a.average;
        });

        return {
            topSkilsSort: topSkilsSort,
            needToImproveSort: needToImproveSort,
            categoriesUsers: categoriesUsersSort
        };
    }

    static async peopleWithSimilarSkills(guid) {
        const similarUsers = [];
        const ourUser = await userModel.findOne({
            where: { guid: guid },
            attributes: {
                exclude: [Constants.Keys.password, Constants.Keys.role_group_id],
            },
            include: [
                {
                    model: skillModel,
                    as: Constants.Associate.Aliases.skills,
                    required: false,
                },
            ],
        });

        const usersSkills = ourUser.skills.map( (skill) => {
            return skill.name;
        });

        const allUsers = await User.getUsers();

        if(usersSkills.length > 0){
            const percent = Math.round((usersSkills.length/100)*30) ;

            allUsers.map( (user) => {
                if(user.guid !== guid) {
                    let count = 0;
                    user.skills.map( (skill) => {
                        if(usersSkills.includes(skill.name)) {
                            count += 1;
                        };
                    });

                    if((count === usersSkills.length && usersSkills.length <= 2) || (count >= percent && usersSkills.length > 2)) {
                        const userInfo = {
                            guid: user.guid,
                            fname: user.fname,
                            lname: user.lname
                        }
                        similarUsers.push(userInfo);
                    }
                }
            });
        }

        return similarUsers;
    }
}
module.exports = DashboardInfo;

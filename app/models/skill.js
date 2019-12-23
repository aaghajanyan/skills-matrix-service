const {
    skill: skillModel,
    category: categoryModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");

class Skill {

    static async getSkillAllData(guid) {
        const skill = await skillModel.findOne({
            where: {guid: guid},
            include: [
                {
                    model: categoryModel,
                    as: "categories",
                    required: false,
                    attributes: ["id", "name"],
                    through: {
                        model: skillRelationModel,
                        as: "skillRelation",
                        attributes: []
                    }
                }
            ]
        });
        return skill;
    };

    static async getSkillsAllData() {
        const skills = await skillModel.findAll({
            include: [
                {
                    model: categoryModel,
                    as: "categories",
                    required: false,
                    attributes: ["id", "name"],
                    through: {
                        model: skillRelationModel,
                        as: "skillRelation",
                        attributes: []
                    }
                }
            ]
        });
        return skills;
    };

    static async addedNewCategories(categoriesId, skill, sendedList, categoriesRequired) {
        sendedList.addedCategories = [];
        sendedList.errors = [];

        if (categoriesId && categoriesId.length > 0) {
            const promise = categoriesId.map(async function (categoryGuid) {
                const category = await categoryModel.findOne({
                    where: {guid: categoryGuid}
                });
                const message = {
                    message: `Category with ${categoryGuid} guid doesn't exist`,
                    success: false
                }

                if (category) {
                    const skillRelation = await skillRelationModel.findOrCreate({
                        where: {
                            skillId: skill.id,
                            categoryId: category.id
                        }
                    });

                    return {
                        id: skill.id,
                        name: skill.name,
                        categoryGuid: category.guid,
                        categoryName: category.name,
                        skillRelationId: skillRelation[0].id,
                        success: true
                    }
                }
                return message;
            });

            await Promise.all(promise).then((list) => {
                list.forEach(item => {
                    sendedList.addedCategories.push(item);
                })
            });
        } else {
            if (categoriesRequired) {
                sendedList.errors.push(errMessageReqCategory);
            }
        }
    }

    static async removeCategories(removedCategories, sendedList, skill) {
        sendedList.removedCategories = [];
        if (removedCategories && removedCategories.length) {
            const promise = removedCategories.map(async function(categoryGuid) {
                const category = await categoryModel.findOne({
                    where: {guid: categoryGuid}
                });

                const obj = {
                    categoryGuid: categoryGuid,
                    status: 'failed'
                }
                const existingSkillCategory = await skillRelationModel.findOne({
                    where: {
                        skillId: skill.id,
                        categoryId: category.id
                    }
                });

                if (existingSkillCategory) {
                    obj.status = 'passed';
                    await existingSkillCategory.destroy();
                }
                return obj;
            })

            await Promise.all(promise).then((list) => {
                sendedList.removedCategories.push(list);
            });
        }
    }

    static async getStatus(sendedList, keyName) {
        let status = false;
        sendedList[keyName].forEach((item) => {
            if (item.success == true) {
                status = true;
            }
        });
        return status;
    }

}

module.exports = Skill;

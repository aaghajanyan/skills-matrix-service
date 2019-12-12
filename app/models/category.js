const {
    category: categoryModel,
    skill: skillModel,
    "categories_relation": categoryRelationModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");

class Category {
    static async addRelatedCategories(relatedCategoriesIds, category, sendedList) {
        sendedList.addedCategories = [];
        if (relatedCategoriesIds && relatedCategoriesIds.length) {
            const promise = relatedCategoriesIds.map(async function(categoryGuid) {
                const relatedCategory = await categoryModel.findOne({
                    where: {guid: categoryGuid}
                });
                const obj = {
                    categoryGuid: category.guid,
                    relatedCategoryGuid: categoryGuid,
                    success: false
                };

                if (relatedCategory) {
                    await categoryRelationModel.findOrCreate({
                        where: {
                            categoryId: category.id,
                            relatedCategoryId: relatedCategory.id
                        }
                    });
                    obj.success = true;
                }
                return obj;
            });
            await Promise.all(promise).then((list) => {
                sendedList.addedCategories.push(list);
            });
        }
    }

    static async removeRelatedCategories(removedCategories, category, sendedList) {
        sendedList.removedCategories = [];
        if (removedCategories && removedCategories.length) {
            const promise = removedCategories.map(async function(categoryGuid) {
                const relatedCategory = await categoryModel.findOne({
                    where: {guid: categoryGuid}
                });
                const obj = {
                    categoryGuid: category.guid,
                    relatedCategoryGuid: categoryGuid,
                    success: false
                }
                const categoryRelation = await categoryRelationModel.findOne({
                    where: {
                        categoryId: category.id,
                        relatedCategoryId: relatedCategory.id
                    }
                });

                if (categoryRelation) {
                    obj.status = true;
                    await categoryRelation.destroy();
                }
                return obj;
            })
            await Promise.all(promise).then((list) => {
                sendedList.removedCategories.push(list);
            });
        }
    }

    static async addSkills(skillsIds, category, sendedList) {
        sendedList.addedSkills = [];
        if (skillsIds && skillsIds.length) {
            const promise = skillsIds.map(async function(skillGuid) {
                const obj = {
                    categoryGuid: category.guid,
                    skillGuid: skillGuid,
                    success: false
                };
                const existingSkill = await skillModel.findOne({
                    where: {guid: skillGuid}
                });

                if (existingSkill) {
                    await skillRelationModel.findOrCreate({
                        where: {
                            skillId: existingSkill.id,
                            categoryId: category.id
                        }
                    });
                    obj.success = true;
                }
                return obj;
            });

            await Promise.all(promise).then((list) => {
                sendedList.addedSkills.push(list);
            });
        }
    }

    static async removeSkills(removedSkills, category, sendedList) {
        sendedList.removedSkills = [];
        if (removedSkills && removedSkills.length) {
            const promise = removedSkills.map(async function(skillGuid) {
                const obj = {
                    categoryGuid: category.guid,
                    skillGuid: skillGuid,
                    success: false
                };
                const skillRelation = await skillRelationModel.findOne({
                    where: {
                        skillGuid: skillGuid,
                        categoryGuid: category.guid
                    }
                });

                if (skillRelation) {
                    obj.status = true;
                    skillRelation.destroy();
                }
                return obj;
            });

            await Promise.all(promise).then((list) => {
                sendedList.removedSkills.push(list);
            })
        }
    }

}

module.exports = Category;
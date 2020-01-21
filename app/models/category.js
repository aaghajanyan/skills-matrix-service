const {
    category: categoryModel,
    skill: skillModel,
    categories_relation: categoryRelationModel,
    skills_relation: skillRelationModel,
} = require('../sequelize/models');

class Category {
    static async findAll() {
        return await categoryModel.findAll();
    }

    static async find(condition) {
        return await categoryModel.findOne({
            where: { ...condition },
        });
    }

    static async findByPk(pk) {
        return await categoryModel.findByPk(pk);
    }

    static async update(data, condition) {
        await categoryModel.update(data, { where: { ...condition } });
    }

    static async findOrCreate(condition) {
        const category = await categoryModel.findOrCreate({
            where: { ...condition },
        });
        return {
            category: category[0],
            isNewRecord: category[1],
        };
    }

    static async addRelatedCategories(
        relatedCategoriesIds,
        category,
        sendedList
    ) {
        try {
            sendedList.addedCategories = [];
            if (relatedCategoriesIds && relatedCategoriesIds.length) {
                const promise = relatedCategoriesIds.map(async function(
                    categoryGuid
                ) {
                    const relatedCategory = await categoryModel.findOne({
                        where: { guid: categoryGuid },
                    });
                    const obj = {
                        categoryGuid: category.guid,
                        relatedCategoryGuid: categoryGuid,
                        success: false,
                    };
                    if (relatedCategory) {
                        await categoryRelationModel.findOrCreate({
                            where: {
                                category_id: category.id,
                                related_category_id: relatedCategory.id,
                            },
                        });
                        obj.success = true;
                    }
                    return obj;
                });
                await Promise.all(promise).then(list => {
                    sendedList.addedCategories.push(list);
                });
            }
        } catch (error) {
            console.log(error); //TBD
        }
    }

    static async mergeRelatedCategories(categories) {
        categories.forEach(category => {
            category.relatedCategories = category.relatedCategories.concat(
                category.relatedCategoriesRef
            );
            delete category.relatedCategoriesRef;
        });
        return categories;
    }

    static async removeRelatedCategories(
        removedCategories,
        category,
        sendedList
    ) {
        sendedList.removedCategories = [];
        if (removedCategories && removedCategories.length) {
            const promise = removedCategories.map(async function(categoryGuid) {
                const relatedCategory = await categoryModel.findOne({
                    where: { guid: categoryGuid },
                });
                const obj = {
                    categoryGuid: category.guid,
                    relatedCategoryGuid: categoryGuid,
                    success: false,
                };
                const categoryRelation = await categoryRelationModel.findOne({
                    where: {
                        category_id: category.id,
                        related_category_id: relatedCategory.id,
                    },
                });

                if (categoryRelation) {
                    obj.status = true;
                    await categoryRelation.destroy();
                }
                return obj;
            });
            await Promise.all(promise).then(list => {
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
                    success: false,
                };
                const existingSkill = await skillModel.findOne({
                    where: { guid: skillGuid },
                });

                if (existingSkill) {
                    await skillRelationModel.findOrCreate({
                        where: {
                            skill_id: existingSkill.id,
                            category_id: category.id,
                        },
                    });
                    obj.success = true;
                }
                return obj;
            });

            await Promise.all(promise).then(list => {
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
                    success: false,
                };
                const skillRelation = await skillRelationModel.findOne({
                    where: {
                        skillGuid: skillGuid,
                        categoryGuid: category.guid,
                    },
                });

                if (skillRelation) {
                    obj.status = true;
                    skillRelation.destroy();
                }
                return obj;
            });

            await Promise.all(promise).then(list => {
                sendedList.removedSkills.push(list);
            });
        }
    }
}

module.exports = Category;

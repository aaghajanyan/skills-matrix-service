const {skill: skillModel, category: categoryModel, skills_relation: skillRelationModel} = require('../sequelize/models');
const {Constants} = require('../constants/Constants');
const {doesNotExistCriteria} = require('../helper/errorResponseBodyBuilder');
const logger = require('../helper/logger');

class Skill {
    static async findAll() {
        return await skillModel.findAll();
    }

    static async findByPk(pk) {
        return await skillModel.findByPk(pk);
    }

    static async find(condition) {
        return await skillModel.findOne({where: {...condition}});
    }

    static async delete(condition) {
        await skillModel.destroy({where: {...condition}});
    }

    static async getSkillAllData(guid) {
        const skill = await skillModel.findOne({
            where: {guid: guid},
            include: [
                {
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    attributes: [Constants.Keys.id, Constants.Keys.name],
                    through: {
                        model: skillRelationModel,
                        as: Constants.Associate.Aliases.skillRelation,
                        attributes: []
                    }
                }
            ]
        });
        return skill;
    }

    static async getSkillsAllData() {
        const skills = await skillModel.findAll({
            include: [
                {
                    model: categoryModel,
                    as: Constants.Associate.Aliases.categories,
                    required: false,
                    attributes: [Constants.Keys.id, Constants.Keys.name],
                    through: {
                        model: skillRelationModel,
                        as: Constants.Associate.Aliases.skillRelation,
                        attributes: []
                    }
                }
            ]
        });
        return skills;
    }

    static async addedNewCategories(categoriesId, skill, sendedList, categoriesRequired) {
        sendedList.addedCategories = [];
        sendedList.errors = [];

        if(categoriesId && categoriesId.length > 0) {
            const promise = categoriesId.map(async function(categoryGuid) {
                const category = await categoryModel.findOne({
                    where: {guid: categoryGuid}
                });
                const message = doesNotExistCriteria(Constants.TypeNames.CATEGORY, categoryGuid);
                if(category) {
                    const skillRelation = await skillRelationModel.findOrCreate({
                        where: {skill_id: skill.id, category_id: category.id}
                    });
                    return {
                        id: skill.id,
                        name: skill.name,
                        categoryGuid: category.guid,
                        categoryName: category.name,
                        skillRelationId: skillRelation[0].id,
                        success: true
                    };
                }
                return message;
            });

            await Promise.all(promise).then(list => {
                list.forEach(item => {
                    sendedList.addedCategories.push(item);
                });
                return;
            });
        } else {
            if(categoriesRequired) {
                sendedList.errors.push({
                    success: false,
                    message: Constants.ModelErrors.CATEGORY_ID_IS_MISSING
                });
            }
        }
    }

    static async removeCategories(removedCategories, sendedList, skill) {
        sendedList.removedCategories = [];
        if(removedCategories && removedCategories.length) {
            const promise = removedCategories.map(async function(categoryGuid) {
                const category = await categoryModel.findOne({
                    where: {guid: categoryGuid}
                });
                const obj = {
                    categoryGuid: categoryGuid,
                    status: false
                };
                const existingSkillCategory = await skillRelationModel.findOne({
                    where: {
                        skill_id: skill.id,
                        category_id: category.id
                    }
                });

                if(existingSkillCategory) {
                    obj.status = true;
                    await existingSkillCategory.destroy();
                }
                return obj;
            });

            await Promise.all(promise).then(list => {
                sendedList.removedCategories.push(list);
                return;
            });
        }
    }

    static async findOneSkill(condition) {
        return await skillModel.findOne({where: {...condition}});
    }

    static async updateSkill(data, condition) {
        await skillModel.update(data, {where: {...condition}});
    }

    static async findOrCreateSkill(condition) {
        const skill = await skillModel.findOrCreate({
            where: {...condition}
        });
        return {
            skill: skill[0],
            isNewRecord: skill[1]
        };
    }

    static getStatus(sendedList, keyName) {
        let status = false;
        sendedList[keyName].forEach(item => {
            if(item.success === true) {
                status = true;
            }
        });
        return status;
    }
}

module.exports = Skill;

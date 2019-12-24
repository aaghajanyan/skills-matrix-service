const {
    skill: skillModel,
    category: categoryModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");
const Skill = require("../models/skill");

const getSkills = async function (_, response) {
    try {
        const skills = await skillModel.findAll();
        return response.status(200).json(skills);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skills.`
        });
    }
};

const getSkill = async function (request, response) {
    try {
        const skill = await skillModel.findOne({where: {guid: request.params.guid}});
        return response.status(200).json(skill);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skill with ${request.params.guid} guid.`
        });
    }
};

const getSkillAllData = async function(request, response) {
    try {
        const skill = await Skill.getSkillAllData(request.params.guid);
        return response.status(200).json(skill);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skill with ${request.params.guid} guid.`
        });
    }
};

const getSkillsAllData = async function(request, response) {
    try {
        const skills = await Skill.getSkillsAllData();
        return response.status(200).json(skills);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skills.`
        });
    }
};

const addSkill = async function (request, response) {
    const errMessageReqCategory = {
        message: 'Required field <categoriesId> doesn\'t exist or empty',
        success: false
    }
    const { categoriesId, ...skillData } = request.body;
    if (categoriesId && categoriesId.length > 0) {
        try {
            const { skill, isNewRecord } = await Skill.findOrCreateSkill({name: skillData.name});
            if(!isNewRecord) {
                return response.status(409).send(`${skillData.name} skill already exist.`);
            }
            const sendedList = [];
            await Skill.addedNewCategories(categoriesId, skill, sendedList, true);
            let status = await Skill.getStatus(sendedList, 'addedCategories') ? 201 : 409;
            return response.status(status).json({
                'name': skill.name,
                'guid': skill.guid,
                'addedCategories': sendedList.addedCategories,
                ...sendedList
            });
        } catch(err) {
            return response.status(409).json({
                success: false,
                message: `Could not add new skill.`
            });
        }
    } else {
        sendedList.errors.push(errMessageReqCategory);
    }
};

const updateSkillAllData = async function (request, response) {
    try {
        const { addCategories, deleteCategories, ...skillData } = request.body;
        const sendedList = [];
        const existingSkill = await Skill.findOneSkill({guid: request.params.guid});

        if(!existingSkill) {
            return response.status(409).json({
                success: false,
                message: `Skill with ${request.params.guid} id doesn't exist`
            });
        }
        await Skill.updateSkill(skillData, { guid: request.params.guid })
        await Skill.addedNewCategories(addCategories, existingSkill, sendedList, false);
        await Skill.removeCategories(deleteCategories, sendedList, existingSkill);
        return response.status(201).json({
            'addedCategories': sendedList.addedCategories,
            'removedCategories': sendedList.removedCategories,
        });
    } catch(err) {
        console.log(err)
        return response.status(409).json({
            success: false,
            message: `Could not get skill with ${request.params.guid} guid.`
        });
    }
};

const updateSkill = async function (request, response) {
    try {
        await Skill.updateSkill(request.body, {guid: request.params.guid});
        return response.status(202).json({success: true});
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skill with ${request.params.guid} guid.`
        });
    }
};

const deleteSkill = async function (request, response) {
    try {
        const skill = await Skill.findOneSkill({ guid: request.params.guid });
        if (!skill) {
            return response.status(409).json({
                success: false,
                message: `Skill with ${request.params.guid} guid does not exists.`
            });
        }
        skill.destroy();
        return response.status(202).json({success: true});
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not delete skill with ${request.params.guid} guid.`
        });
    }
};

module.exports = {
    getSkills,
    getSkill,
    getSkillAllData,
    getSkillsAllData,
    addSkill,
    updateSkill,
    updateSkillAllData,
    deleteSkill
};

const { OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    getStatusText } = require('http-status-codes');

const {
    skill: skillModel,
    category: categoryModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");
const Skill = require("../models/skill");
const { Constants } = require('../constants/Constants');


const getSkills = async function (_, response) {
    try {
        const skills = await skillModel.findAll();
        return response.status(OK).json(skills);
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_GET_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const getSkill = async function (request, response) {
    try {
        const skill = await skillModel.findOne({where: {guid: request.params.guid}});
        return response.status(OK).json(skill);
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_GET_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const getSkillAllData = async function(request, response) {
    try {
        const skill = await Skill.getSkillAllData(request.params.guid);
        return response.status(OK).json(skill);
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_GET_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const getSkillsAllData = async function(request, response) {
    try {
        const skills = await Skill.getSkillsAllData();
        return response.status(OK).json(skills);
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_GET_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const addSkill = async function (request, response) {
    const { categoriesId, ...skillData } = request.body;
    if (categoriesId && categoriesId.length > 0) {
        try {
            const { skill, isNewRecord } = await Skill.findOrCreateSkill({name: skillData.name});
            if(!isNewRecord) {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${getStatusText(CONFLICT)} ${skillData.name} ${Constants.Controllers.Skills.SKILL_ALREADY_EXISTS}`
                });
            }
            const sendedList = [];
            await Skill.addedNewCategories(categoriesId, skill, sendedList, true);
            let status = await Skill.getStatus(sendedList, Constants.Migrations.addedCategories) ? CREATED : CONFLICT;
            const u = 5;
            ++u
            return response.status(status).json({
                [Constants.Migrations.name]: skill.name,
                [Constants.Migrations.guid]: skill.guid,
                [Constants.Migrations.addedCategories]: sendedList.addedCategories,
                ...sendedList
            });
        } catch(err) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${Constants.Controllers.Skills.COULD_NOT_ADD_SKILL} ${getStatusText(CONFLICT)}`
            });
        }
    } else {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_ADD_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const updateSkillAllData = async function (request, response) {
    try {
        const { addCategories, deleteCategories, ...skillData } = request.body;
        const sendedList = [];
        const existingSkill = await Skill.findOneSkill({guid: request.params.guid});

        if(!existingSkill) {
            return response.status(CONFLICT).json({
                success: false,
                message: Constants.notExists(Constants.Migrations.SKILL, request.params.guid, Constants.Migrations.id)
            });
        }
        await Skill.updateSkill(skillData, { guid: request.params.guid })
        await Skill.addedNewCategories(addCategories, existingSkill, sendedList, false);
        await Skill.removeCategories(deleteCategories, sendedList, existingSkill);
        return response.status(201).json({
            [Constants.Migrations.addedCategories]: sendedList.addedCategories,
            [Constants.Migrations.removedCategories]: sendedList.removedCategories,
        });
    } catch(err) {
        console.log(err)
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_UPDATE_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const updateSkill = async function (request, response) {
    try {
        await Skill.updateSkill(request.body, {guid: request.params.guid});
        return response.status(ACCEPTED).json({success: true});
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_UPDATE_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
        });
    }
};

const deleteSkill = async function (request, response) {
    try {
        const skill = await Skill.findOneSkill({ guid: request.params.guid });
        if (!skill) {
            return response.status(CONFLICT).json({
                success: false,
                message: Constants.notExists(Constants.Migrations.SKILL, request.params.guid, Constants.Migrations.id)
            });
        }
        skill.destroy();
        return response.status(ACCEPTED).json({success: true});
    } catch(err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${Constants.Controllers.Skills.COULD_NOT_DELETE_SKILL} ${getStatusText(INTERNAL_SERVER_ERROR)}`
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

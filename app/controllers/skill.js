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
        const skill = await skillModel
            .findOne({
                where: {guid: request.params.guid},
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
        const skills = await skillModel
            .findAll({
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
        return response.status(200).json(skills);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skills.`
        });
    }
};

const getStatus = async function(sendedList, keyName) {
    let status = false;
    sendedList[keyName].forEach((item) => {
        if (item.success == true) {
            status = true;
        }
    });
    return status;
}

const addSkill = async function (request, response) {
    const errMessageReqCategory = {
        message: 'Required field <categoriesId> doesn\'t exist or empty',
        success: false
    } 
    const { categoriesId, ...skillData } = request.body;
    if (categoriesId && categoriesId.length > 0) {
        try {
            const skill = await skillModel.findOrCreate({
                where: { name: skillData.name }
            });
            if(!skill[1]) {
                response.status(409).send(`${skillData.name} skill already exist`);
                return;
            }
            const sendedList = [];
            await Skill.addedNewCategories(categoriesId, skill[0], sendedList, true);
            let status = await getStatus(sendedList, 'addedCategories') ? 201 : 409;
            return response.status(status).json({
                'name': skill[0].name,
                'guid': skill[0].guid,
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
        const existingSkill = await skillModel.findOne({where : {guid: request.params.guid}});

        if(!existingSkill) {
            response.status(409).json({
                success: false,
                message: `Skill with ${request.params.guid} id doesn't exist`
            });
            return;
        }
        await skillModel.update(skillData,
            { where: { guid: request.params.guid }
        });
        await Skill.addedNewCategories(addCategories, existingSkill, sendedList, false);
        await Skill.removeCategories(deleteCategories, sendedList, existingSkill);
        return response.status(201).json({
            'addedCategories': sendedList.addedCategories,
            'removedCategories': sendedList.removedCategories,
        });
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get skill with ${request.params.guid} guid.`
        });
    }
};

const updateSkill = async function (request, response) {
    try {
        await skillModel.update(request.body, {
            where: { guid: request.params.guid }
        });
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
        const skill = await skillModel.findOne({
            where: { guid: request.params.guid }
        });
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

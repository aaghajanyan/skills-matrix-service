const {
    skill: skillModel,
    category: categoryModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");

const getSkillsRelations = async function(_, response) {
    const skillsRelations = await skillRelationModel.findAll();
    response.status(200).json(skillsRelations);
};

const getSkillRelation = async function(request, response) {
    const skillRelation = await skillRelationModel.findByPk(request.params.skillRelationId);
    response.status(200).json(skillRelation);
};

const addSkillRelation =  async function(request, response) {
    const category = await categoryModel.findByPk(request.body.categoryId);
    if (category) {
        const skill = await skillModel.findByPk(request.body.skillId);
        if (skill) {
            const skillRelation = await skillRelationModel.create(request.body);
            response.status(201).json({ id: skillRelation.id })
        } else {
            response.status(409).json({
                success: false,
                message: `Skill doesn't exist`
            });
        }
    } else {
        response.status(409).json({
            success: false,
            message: `Category doesn't exist`
        });
    }
};

const updateSkillRelation =  async function(request, response) {
    const category = await categoryModel.findByPk(request.body.categoryId);
    if (category) {
        await skillRelationModel.update(request.body, {
            where: { id: request.params.skillRelationId }
        });
        response.status(202).send();
    } else {
        response.status(409).json({
            success: false,
            message: `Category doesn't exist`
        });
    }
};

const deleteSkillRelation =  async function(request, response) {
    await skillRelationModel.destroy({ where: { id: request.params.skillRelationId } });
    response.status(202).send();
};

module.exports = {
    getSkillsRelations,
    getSkillRelation,
    addSkillRelation,
    updateSkillRelation,
    deleteSkillRelation
};

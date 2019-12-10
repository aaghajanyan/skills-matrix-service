const {
    category: categoryModel,
    "categories_relation": categoryRelationModel
} = require("../sequelize/models");

const getCategoriesRelations = async function(_, response) {
    const categoriesRelations = await categoryRelationModel.findAll();
    if(categoriesRelations && categoriesRelations.length == 0) {
        response.status(409).send(`Relation categories does not exist.`);
        return;
    }
    response.status(200).json(categoriesRelations);
};

const getCategoryRelation = async function(request, response) {
    const categoryRelation = await categoryRelationModel.findByPk(request.params.categoryRelationId)
    if(!categoryRelation) {
        response.status(409).send(`Relation category does not exist.`);
        return;
    }
    response.status(200).json(categoryRelation);
};

const addCategoryRelation = async function(request, response) {
    const category = await categoryModel.findByPk(request.body.categoryId);
    if (category) {
        const existingCategory = await categoryModel.findByPk(request.body.relatedCategoryId);
        if (existingCategory) {
            const categoryRelation = await categoryRelationModel.create(request.body);
            response.status(201).json({ id: categoryRelation.id });
        } else {
            response.status(409).send("Related category doesn't exist");
        }
    } else {
        response.status(409).send("Category doesn't exist");
    }
};

const updateCategoryRelation = async function(request, response) {
    const category = await categoryModel.findByPk(request.body.relatedCategoryId);
    if (category) {
        await categoryRelationModel.update(request.body, {
            where: { id: request.params.categoryRelationId }
        });
        response.status(202).send();
    } else {
        response.status(409).send("Related category doesn't exist");
    }
};

const deleteCategoryRelation = async function(request, response) {
    await categoryRelationModel.destroy({ where: { id: request.params.categoryRelationId } });
    response.status(202).send();
};

module.exports = {
    getCategoriesRelations,
    getCategoryRelation,
    addCategoryRelation,
    updateCategoryRelation,
    deleteCategoryRelation
};
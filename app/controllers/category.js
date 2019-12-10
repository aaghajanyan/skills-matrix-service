const {
    category: categoryModel,
    skill: skillModel,
    "categories_relation": categoryRelationModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");

const Category = require("../models/category");

const getCategories = async function(_, response) {
    try {
        const categories = await categoryModel.findAll();
        return response.status(200).json(categories);
    } catch {
        return response.status(409).send({
            success: false,
            message: 'Could not get categories.'
        });
    }
};
 
const getCategory = async function(request, response) {
    try {
        const category = await categoryModel.findOne({ where: {guid: request.params.guid}});
        response.status(200).json(category);
    } catch {
        return response.status(409).send({
            success: false,
            message: `Could not get category with ${request.params.guid} guid.`
        });
    }
};

const updateCategory = async function(request, response) {
    try {
        await categoryModel.update(request.body,
            { where: { guid: request.params.guid }
        });
        response.status(202).send({"success": true});
    } catch {
        return response.status(400).send({
            success: false,
            message: `Could not update category with ${request.params.guid} guid`
        });
    }
};

const deleteCategory = async function(request, response) {
    try {
        const category = await categoryModel.findOne({ where: { guid: request.params.guid } })
        if (!category) {
            return response.status(409).send({
                success: false,
                message: `Category with ${request.params.guid} guid does not exists`
            });
        }
        category.destroy();
        response.status(202).send({"success": true});
    } catch {
        return response.status(400).send({
            success: false,
            message: `Could not delete category with ${request.params.guid} guid`
        });
    }

};

const includeModel = (modelName, alians, required, attributes, through_modelName, through_alians, through_attributes) => {
    return {
        model: modelName,
        as: alians,
        required: required,
        attributes: attributes,
        through: {
            model: through_modelName,
            as: through_alians,
            attributes: through_attributes
        }
    }
}

const getCategoriesAllData = async function(_, response) {
    try {
        const categories = await categoryModel
        .findAll({
            include: [
                {
                    model: categoryModel,
                    as: "relatedCategories",
                    required: false,
                    attributes: ["id", "name"],
                    through: {
                        model: categoryRelationModel,
                        as: "categoryRelation",
                        attributes: []
                    },
                    include: includeModel(skillModel, 'skills', false, ['id', 'name'], skillRelationModel, 'skillRelation', [])
                },
                {
                    model: categoryModel,
                    as: "relatedCategoriesRef",
                    required: false,
                    attributes: ["id", "name"],
                    through: {
                        model: categoryRelationModel,
                        as: "categoryRelation",
                        attributes: []
                    },
                    include: includeModel(skillModel, 'skills', false, ['id', 'name'], skillRelationModel, 'skillRelation', [])
                },
                includeModel(skillModel, 'skills', false, ['id', 'name'], skillRelationModel, 'skillRelation', [])
            ]
        })
        response.status(200).json(mergeRelatedCategories(
            JSON.parse(JSON.stringify(categories))
        ));
    } catch {
        response.status(400).json({
            success: false,
            message: 'Could not get categories.'
        });
    }
};

const getCategoryAllData = async function(request, response) {
    try {
        const categories = await categoryModel
        .findOne({
            where: {guid: request.params.guid},
            include: [
                {
                    model: categoryModel,
                    as: "relatedCategories",
                    required: false,
                    attributes: ["id", "name"],
                    through: {
                        model: categoryRelationModel,
                        as: "categoryRelation",
                        attributes: []
                    },
                    include: includeModel(skillModel, 'skills', false, ['id', 'name'], skillRelationModel, 'skillRelation', [])
                },
                {
                    model: categoryModel,
                    as: "relatedCategoriesRef",
                    required: false,
                    attributes: ["id", "name"],
                    through: {
                        model: categoryRelationModel,
                        as: "categoryRelation",
                        attributes: []
                    },
                    include: includeModel(skillModel, 'skills', false, ['id', 'name'], skillRelationModel, 'skillRelation', [])
                },
                includeModel(skillModel, 'skills', false, ['id', 'name'], skillRelationModel, 'skillRelation', [])
            ]
        });
        return response.status(200).json(categories);
    } catch {
        return response.status(400).json({
            success: false,
            message: `Could not get category with ${request.params.guid} guid.`
        });
    }
};

const mergeRelatedCategories = categories => {
    categories.forEach(category => {
        category.relatedCategories = category.relatedCategories.concat(
            category.relatedCategoriesRef
        );
        delete category.relatedCategoriesRef;
    });
    return categories;
};

const addCategory = async function (request, response) {
    try {
        const sendedList = [];
        const { relatedCategoriesIds, skillsIds, ... categoryData} = request.body;
        const newCategory = await categoryModel.findOrCreate({
            where: { name: categoryData.name }
        });
        if(!newCategory[1]) {
            response.status(409).send(`${categoryData.name} category already exist`);
            return;
        }
        await Category.addRelatedCategories(relatedCategoriesIds, newCategory[0], sendedList);
        await Category.addSkills(skillsIds, newCategory[0], sendedList);
        return response.status(201).json({
            'name': newCategory[0].name,
            'guid': newCategory[0].guid,
            'addRelatedCategories': sendedList.addedCategories,
            'addedSkills': sendedList.addedSkills
        });
    } catch {
        return response.status(400).json({
            success: false,
            message: 'Could not add new category.'
        });
    }
};

const updateCategoryAllData = async function (request, response) {
    try {
        const sendedList = [];
        const { addedCategories, removedCategories, addedskills, removedSkills, ...categoryData} = request.body;
        const existingCategory = await categoryModel.findOne({where: {guid: request.params.guid}});

        if(!existingCategory) {
            response.status(409).send(`Category with ${request.params.guid} guid doesn't exist`);
            return;
        }

        await categoryModel.update(categoryData,
            { where: { guid: request.params.guid }
        });

        await Category.addRelatedCategories(addedCategories, existingCategory, sendedList);
        await Category.removeRelatedCategories(removedCategories, existingCategory, sendedList);
        await Category.addSkills(addedskills, existingCategory, sendedList);
        await Category.removeSkills(removedSkills, existingCategory, sendedList);

        return response.status(201).json({
            'addRelatedCategories': sendedList.addedCategories,
            'removedRelatedCategories': sendedList.removedCategories,
            'addedSkills': sendedList.addedSkills,
            'removedSkills': sendedList.removedSkills
        });
    } catch {
        return response.status(409).send({
            success: false,
            message: `Category with ${request.body.name} name already exists`
        });
    }
};

module.exports = {
    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    updateCategoryAllData,
    deleteCategory,
    getCategoriesAllData,
    getCategoryAllData
};

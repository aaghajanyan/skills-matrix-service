const {
    category: categoryModel,
    skill: skillModel,
    "categories_relation": categoryRelationModel,
    "skills_relation": skillRelationModel
} = require("../sequelize/models");

const Category = require("../models/category");

const getCategories = async function(_, response) {
    try {
        const categories = await Category.findAllCategories();
        return response.status(200).json(categories);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: 'Could not get categories.'
        });
    }
};

const getCategory = async function(request, response) {
    try {
        const category = await Category.findOneCategory({ guid: request.params.guid });
        response.status(200).json(category);
    } catch(err) {
        return response.status(409).json({
            success: false,
            message: `Could not get category with ${request.params.guid} guid.`
        });
    }
};

const updateCategory = async function(request, response) {
    try {
        await Category.updateCategory(request.body, { guid: request.params.guid });
        response.status(202).json({success: true});
    } catch(err) {
        return response.status(400).json({
            success: false,
            message: `Could not update category with ${request.params.guid} guid`
        });
    }
};

const deleteCategory = async function(request, response) {
    try {
        const category = await Category.findOneCategory({ guid: request.params.guid });
        if (!category) {
            return response.status(409).json({
                success: false,
                message: `Category with ${request.params.guid} guid does not exists`
            });
        }
        category.destroy();
        response.status(202).json({success: true});
    } catch(err) {
        return response.status(500).json({
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
        response.status(200).json(await Category.mergeRelatedCategories(
            JSON.parse(JSON.stringify(categories))
        ));
    } catch(err) {
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
    } catch(err) {
        return response.status(400).json({
            success: false,
            message: `Could not get category with ${request.params.guid} guid.`
        });
    }
};

const addCategory = async function (request, response) {
    try {
        const sendedList = [];
        const { relatedCategoriesIds, skillsIds, ... categoryData } = request.body;
        const { category, isNewRecord } = await Category.findOrCreateCategory({ name: categoryData.name });
        if(!isNewRecord) {
            response.status(409).json({success: false,
                message: `${categoryData.name} category already exist`
            });
            return;
        }
        await Category.addRelatedCategories(relatedCategoriesIds, category, sendedList);
        await Category.addSkills(skillsIds, category, sendedList);
        return response.status(201).json({
            'name': category.name,
            'guid': category.guid,
            'addRelatedCategories': sendedList.addedCategories,
            'addedSkills': sendedList.addedSkills
        });
    } catch(err) {
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
        const existingCategory = await Category.findOneCategory({ guid: request.params.guid });

        if(!existingCategory) {
            return response.status(409).json({
                success: false,
                message: `Category with ${request.params.guid} guid doesn't exist`
            });
        }
        await Category.updateCategory(categoryData, { guid: request.params.guid });
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
    } catch(err) {
        return response.status(409).json({
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

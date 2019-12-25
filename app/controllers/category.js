const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    getStatusText
} = require("http-status-codes");
const {
    category: categoryModel,
    skill: skillModel,
    categories_relation: categoryRelationModel,
    skills_relation: skillRelationModel
} = require("../sequelize/models");
const { Constants } = require("../constants/Constants");
const Category = require("../models/category");

const getCategories = async function(_, response) {
    try {
        const categories = await Category.findAll();
        return response.status(OK).json(categories);
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const getCategory = async function(request, response) {
    try {
        const category = await Category.find({ guid: request.params.guid });
        response.status(200).json(category);
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const updateCategory = async function(request, response) {
    try {
        await Category.update(request.body, { guid: request.params.guid });
        response.status(202).json({ success: true });
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const deleteCategory = async function(request, response) {
    try {
        const category = await Category.find({ guid: request.params.guid });
        if (!category) {
            return response.status(CONFLICT).json({
                success: false,
                message: Constants.notExists(
                    Constants.Migrations.CATEGORY,
                    request.params.guid,
                    Constants.Migrations.id
                )
            });
        }
        category.destroy();
        response.status(ACCEPTED).json({ success: true });
    } catch (err) {
        return response.status(500).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const includeModel = (
    modelName,
    alians,
    required,
    attributes,
    through_modelName,
    through_alians,
    through_attributes
) => {
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
    };
};

const getCategoriesAllData = async function(_, response) {
    try {
        const categories = await categoryModel.findAll({
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
                    include: includeModel(
                        skillModel,
                        "skills",
                        false,
                        ["id", "name"],
                        skillRelationModel,
                        "skillRelation",
                        []
                    )
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
                    include: includeModel(
                        skillModel,
                        "skills",
                        false,
                        ["id", "name"],
                        skillRelationModel,
                        "skillRelation",
                        []
                    )
                },
                includeModel(
                    skillModel,
                    "skills",
                    false,
                    ["id", "name"],
                    skillRelationModel,
                    "skillRelation",
                    []
                )
            ]
        });
        response
            .status(OK)
            .json(
                await Category.mergeRelatedCategories(
                    JSON.parse(JSON.stringify(categories))
                )
            );
    } catch (err) {
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const getCategoryAllData = async function(request, response) {
    try {
        const categories = await categoryModel.findOne({
            where: { guid: request.params.guid },
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
                    include: includeModel(
                        skillModel,
                        "skills",
                        false,
                        ["id", "name"],
                        skillRelationModel,
                        "skillRelation",
                        []
                    )
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
                    include: includeModel(
                        skillModel,
                        "skills",
                        false,
                        ["id", "name"],
                        skillRelationModel,
                        "skillRelation",
                        []
                    )
                },
                includeModel(
                    skillModel,
                    "skills",
                    false,
                    ["id", "name"],
                    skillRelationModel,
                    "skillRelation",
                    []
                )
            ]
        });
        return response.status(OK).json(categories);
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const addCategory = async function(request, response) {
    try {
        const sendedList = [];
        const {
            relatedCategoriesIds,
            skillsIds,
            ...categoryData
        } = request.body;
        const { category, isNewRecord } = await Category.findOrCreate({
            name: categoryData.name
        });
        if (!isNewRecord) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                    Constants.Controllers.TypeNames.CATEGORY
                )}`
            });
        }
        await Category.addRelatedCategories(
            relatedCategoriesIds,
            category,
            sendedList
        );
        await Category.addSkills(skillsIds, category, sendedList);
        return response.status(201).json({
            [Constants.Migrations.name]: category.name,
            [Constants.Migrations.guid]: category.guid,
            [Constants.Migrations.addRelatedCategories]:
                sendedList.addedCategories,
            [Constants.Migrations.addedSkills]: sendedList.addedSkills
        });
    } catch (err) {
        console.log(err);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`
        });
    }
};

const updateCategoryAllData = async function(request, response) {
    try {
        const sendedList = [];
        const {
            addedCategories,
            removedCategories,
            addedskills,
            removedSkills,
            ...categoryData
        } = request.body;
        const existingCategory = await Category.findOneCategory({
            guid: request.params.guid
        });

        if (!existingCategory) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.notExists(
                    Constants.Migrations.CATEGORY,
                    request.params.guid,
                    Constants.Migrations.id
                )}`
            });
        }
        await Category.update(categoryData, { guid: request.params.guid });
        await Category.addRelatedCategories(
            addedCategories,
            existingCategory,
            sendedList
        );
        await Category.removeRelatedCategories(
            removedCategories,
            existingCategory,
            sendedList
        );
        await Category.addSkills(addedskills, existingCategory, sendedList);
        await Category.removeSkills(
            removedSkills,
            existingCategory,
            sendedList
        );
        return response.status(201).json({
            [Constants.Migrations.addRelatedCategories]:
                sendedList.addedCategories,
            [Constants.Migrations.removedRelatedCategories]:
                sendedList.removedCategories,
            [Constants.Migrations.addedSkills]: sendedList.addedSkills,
            [Constants.Migrations.removedSkills]: sendedList.removedSkills
        });
    } catch (err) {
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                Constants.Controllers.TypeNames.CATEGORY
            )}`
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

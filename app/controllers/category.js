const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED
} = require('http-status-codes');
const {
    category: categoryModel,
    skill: skillModel,
    categories_relation: categoryRelationModel,
    skills_relation: skillRelationModel,
} = require('../sequelize/models');
const { Constants } = require('../constants/Constants');
const Category = require('../models/category');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getCategories = async function(_, response) {
    try {
        const categories = await Category.findAll();
        return response.status(OK).json(categories);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const getCategory = async function(request, response) {
    try {
        const category = await Category.find({ guid: request.params.guid });
        response.status(200).json(category);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const updateCategory = async function(request, response) {
    try {
        await Category.update(request.body, { guid: request.params.guid });
        response.status(202).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const deleteCategory = async function(request, response) {
    try {
        await Category.delete({ guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
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
            attributes: through_attributes,
        },
    };
};

const getCategoriesAllData = async function(_, response) {
    try {
        // const categories = await Category.getCategoriesAllData();
        const categories = await categoryModel.findAll({
            include: [
                {
                    model: categoryModel,
                    as: Constants.Associate.Aliases.relatedCategories,
                    required: false,
                    attributes: [Constants.Keys.id, Constants.Keys.name],
                    through: {
                        model: categoryRelationModel,
                        as: Constants.Associate.Aliases.categoryRelation,
                        attributes: [],
                    },
                    include: includeModel(
                        skillModel,
                        Constants.Keys.skills,
                        false,
                        [Constants.Keys.id, Constants.Keys.name],
                        skillRelationModel,
                        Constants.Associate.Aliases.skillRelation,
                        []
                    ),
                },
                {
                    model: categoryModel,
                    as: Constants.Associate.Aliases.relatedCategoriesRef,
                    required: false,
                    attributes: [Constants.Keys.id, Constants.Keys.name],
                    through: {
                        model: categoryRelationModel,
                        as: Constants.Associate.Aliases.categoryRelation,
                        attributes: [],
                    },
                    include: includeModel(
                        skillModel,
                        Constants.Keys.skills,
                        false,
                        [Constants.Keys.id, Constants.Keys.name],
                        skillRelationModel,
                        Constants.Associate.Aliases.skillRelation,
                        []
                    ),
                },
                includeModel(
                    skillModel,
                    Constants.Keys.skills,
                    false,
                    [Constants.Keys.id, Constants.Keys.name],
                    skillRelationModel,
                    Constants.Associate.Aliases.skillRelation,
                    []
                ),
            ],
        });
        return response
            .status(OK)
            .json(
                await Category.mergeRelatedCategories(
                    JSON.parse(JSON.stringify(categories))
                )
            );
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
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
                    as: Constants.Associate.Aliases.relatedCategories,
                    required: false,
                    attributes: [Constants.Keys.id, Constants.Keys.name],
                    through: {
                        model: categoryRelationModel,
                        as: Constants.Associate.Aliases.categoryRelation,
                        attributes: [],
                    },
                    include: includeModel(
                        skillModel,
                        Constants.Keys.skills,
                        false,
                        [Constants.Keys.id, Constants.Keys.name],
                        skillRelationModel,
                        Constants.Associate.Aliases.skillRelation,
                        []
                    ),
                },
                {
                    model: categoryModel,
                    as: Constants.Associate.Aliases.relatedCategoriesRef,
                    required: false,
                    attributes: [Constants.Keys.id, Constants.Keys.name],
                    through: {
                        model: categoryRelationModel,
                        as: Constants.Associate.Aliases.categoryRelation,
                        attributes: [],
                    },
                    include: includeModel(
                        skillModel,
                        Constants.Keys.skills,
                        false,
                        [Constants.Keys.id, Constants.Keys.name],
                        skillRelationModel,
                        Constants.Associate.Aliases.skillRelation,
                        []
                    ),
                },
                includeModel(
                    skillModel,
                    Constants.Keys.skills,
                    false,
                    [Constants.Keys.id, Constants.Keys.name],
                    skillRelationModel,
                    Constants.Associate.Aliases.skillRelation,
                    []
                ),
            ],
        });
        return response.status(OK).json(categories);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
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
            name: categoryData.name,
        });

        if (!isNewRecord) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                    Constants.Controllers.TypeNames.CATEGORY
                )}`,
            });
        }
        await Category.addRelatedCategories(relatedCategoriesIds, category, sendedList);
        await Category.addSkills(skillsIds, category, sendedList);
        return response.status(201).json({
            [Constants.Keys.name]: category.name,
            [Constants.Keys.guid]: category.guid,
            [Constants.Keys.addRelatedCategories]: sendedList.addedCategories,
            [Constants.Keys.addedSkills]: sendedList.addedSkills,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.CATEGORY.toLowerCase()
            )}`,
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
        const existingCategory = await Category.find({
            guid: request.params.guid,
        });

        if (!existingCategory) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.elementDoesNotExist(
                    Constants.Controllers.TypeNames.CATEGORY,
                    request.params.guid,
                    Constants.Keys.id
                )}`,
            });
        }
        await Category.update(categoryData, { guid: request.params.guid });
        await Category.addRelatedCategories(addedCategories, existingCategory, sendedList);
        await Category.removeRelatedCategories(removedCategories, existingCategory, sendedList);
        await Category.addSkills(addedskills, existingCategory, sendedList);
        await Category.removeSkills(removedSkills, existingCategory, sendedList);
        return response.status(201).json({
            [Constants.Keys.addRelatedCategories]: sendedList.addedCategories,
            [Constants.Keys.removedRelatedCategories]:
                sendedList.removedCategories,
            [Constants.Keys.addedSkills]: sendedList.addedSkills,
            [Constants.Keys.removedSkills]: sendedList.removedSkills,
        });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.ALREADY_EXISTS,
                Constants.Controllers.TypeNames.CATEGORY
            )}`,
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
    getCategoryAllData,
};

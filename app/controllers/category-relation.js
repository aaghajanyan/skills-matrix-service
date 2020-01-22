const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CONFLICT,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const Category = require('../models/category');
const CategoryRelation = require('../models/category-relation');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getCategoriesRelations = async function(_, response) {
    try {
        const categoriesRelations = await CategoryRelation.findAll();
        if (categoriesRelations && !categoriesRelations.length) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.REL_CATEGORY
                )}`,
            });
        }
        return response.status(OK).json(categoriesRelations);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const getCategoryRelation = async function(request, response) {
    try {
        const categoryRelation = await CategoryRelation.find({
            guid: request.params.categoryRelationId,
        });
        if (!categoryRelation) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.REL_CATEGORY
                )}`,
            });
        }
        return response.status(OK).json(categoryRelation);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const addCategoryRelation = async function(request, response) {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            const existingCategory = await Category.findByPk(
                request.body.related_rategory_id
            );
            if (existingCategory) {
                const categoryRelation = await CategoryRelation.create(
                    request.body
                );
                return response
                    .status(CREATED)
                    .json({ id: categoryRelation.id });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.REL_CATEGORY
                    )}`,
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.REL_CATEGORY
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const updateCategoryRelation = async function(request, response) {
    try {
        await CategoryRelation.update(request.body, {
            category_id: request.params.categoryRelationId,
        });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const deleteCategoryRelation = async function(request, response) {
    try {
        await CategoryRelation.delete({
            guid: request.params.categoryRelationId,
        });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

module.exports = {
    getCategoriesRelations,
    getCategoryRelation,
    addCategoryRelation,
    updateCategoryRelation,
    deleteCategoryRelation,
};

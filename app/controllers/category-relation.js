const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CONFLICT,
    CREATED,
    getStatusText
} = require("http-status-codes");
const { Constants } = require("../constants/Constants");
const Category = require("../models/category");
const CategoryRelation = require("../models/category-relation");
const logger = require("../helper/logger");

const getCategoriesRelations = async function(_, response) {
    try {
        const categoriesRelations = await CategoryRelation.findAll();
        if (categoriesRelations && categoriesRelations.length == 0) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.REL_CATEGORY
                )}`
            });
        }
        return response.status(OK).json(categoriesRelations);
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
            )}`
        });
    }
};

const getCategoryRelation = async function(request, response) {
    try {
        const categoryRelation = await CategoryRelation.findByPk(
            request.params.categoryRelationId
        );
        if (!categoryRelation) {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}.
                    ${Constants.parse(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.REL_CATEGORY
                    )}`
            });
        }
        return response.status(OK).json(categoryRelation);
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${getStatusText(INTERNAL_SERVER_ERROR)}.
                ${Constants.parse(
                    Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                    Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
                )}`
        });
    }
};

const addCategoryRelation = async function(request, response) {
    try {
        const category = await Category.findByPk(request.body.categoryId);
        if (category) {
            const existingCategory = await Category.findByPk(
                request.body.relatedCategoryId
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
                    message: `${getStatusText(CONFLICT)}.
                    ${Constants.parse(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.REL_CATEGORY
                    )}`
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}.
                    ${Constants.parse(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.REL_CATEGORY
                    )}`
            });
        }
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${getStatusText(INTERNAL_SERVER_ERROR)}.
                    ${Constants.parse(
                        Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                        Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
                    )}`
        });
    }
};

const updateCategoryRelation = async function(request, response) {
    try {
        const category = await Category.findByPk(
            request.body.relatedCategoryId
        );
        if (category) {
            await CategoryRelation.update(request.body, {
                id: request.params.categoryRelationId
            });
            return response.status(ACCEPTED).json({ success: true });
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}.
                ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.REL_CATEGORY
                )}`
            });
        }
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${getStatusText(INTERNAL_SERVER_ERROR)}.
                    ${Constants.parse(
                        Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                        Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
                    )}`
        });
    }
};

const deleteCategoryRelation = async function(request, response) {
    try {
        await CategoryRelation.delete({
            id: request.params.categoryRelationId
        });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).send({
            success: false,
            message: `${getStatusText(INTERNAL_SERVER_ERROR)}.
                    ${Constants.parse(
                        Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                        Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
                    )}`
        });
    }
};

module.exports = {
    getCategoriesRelations,
    getCategoryRelation,
    addCategoryRelation,
    updateCategoryRelation,
    deleteCategoryRelation
};

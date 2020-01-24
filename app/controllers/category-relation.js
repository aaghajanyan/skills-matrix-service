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
const {
    couldNotGetCriteria,
    doesNotExistCriteria,
    couldNotAddCriteria,
    couldNotUpdateCriteria,
    couldNotDeleteCriteria
 } = require('../helper/errorResponseBodyBuilder');

const getCategoriesRelations = async function(_, response) {
    try {
        const categoriesRelations = await CategoryRelation.findAll();
        return response.status(OK).json(categoriesRelations);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send(
            couldNotGetCriteria(Constants.TypeNames.REL_CATEGORIES.toLowerCase())
        );
    }
};

const getCategoryRelation = async function(request, response) {
    try {
        const categoryRelation = await CategoryRelation.find({
            guid: request.params.categoryRelationId,
        });
        return response.status(OK).json(categoryRelation);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send(
            couldNotGetCriteria(Constants.TypeNames.REL_CATEGORY.toLowerCase(), request.params.categoryRelationId)
        );
    }
};

const addCategoryRelation = async function(request, response) {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            const existingCategory = await Category.findByPk(
                request.body.related_category_id
            );
            if (existingCategory) {
                const categoryRelation = await CategoryRelation.create(request.body);
                return response.status(CREATED).json({ id: categoryRelation.id });
            } else {
                return response.status(CONFLICT).json(
                    doesNotExistCriteria(Constants.TypeNames.REL_CATEGORY.toLowerCase(), request.body.related_category_id)
                );
            }
        } else {
            return response.status(CONFLICT).json(
                doesNotExistCriteria(Constants.TypeNames.CATEGORY.toLowerCase(), request.body.category_id)
            );
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).send(
            couldNotAddCriteria(Constants.TypeNames.CATEGORY.toLowerCase(), request.body.category_id)
        );
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
        return response.status(INTERNAL_SERVER_ERROR).send(
            couldNotUpdateCriteria(Constants.TypeNames.REL_CATEGORY.toLowerCase(), request.params.categoryRelationId)
        );
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
        return response.status(INTERNAL_SERVER_ERROR).send(
            couldNotDeleteCriteria(Constants.TypeNames.REL_CATEGORY.toLowerCase(), request.params.categoryRelationId)
        );
    }
};

module.exports = {
    getCategoriesRelations,
    getCategoryRelation,
    addCategoryRelation,
    updateCategoryRelation,
    deleteCategoryRelation,
};

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
        const categoryRelation = await CategoryRelation.find(
            { guid: request.params.categoryRelationId }
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
        console.log(error)
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
        await CategoryRelation.update(request.body, {
            category_id: request.params.categoryRelationId,
        });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        console.log(error)
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

// const updateCategoryRelation = async function(request, response) {
//     try {
//         const category = await Category.find({
//             guid: request.body.related_category_id
//         });
//         console.log("CAT", category);
//         if (category) {
//             const relCategory = await Category.find({
//                 guid: request.body.related_category_id
//             });
//             if (relCategory) {
//                 console.log(" REL CAT", category);

//                 await CategoryRelation.update({related_category_id: relCategory.id}, {
//                     category_id: category.id
//                 });
//                 return response.status(ACCEPTED).json({ success: true });
//             }
//         } else {
//             return response.status(CONFLICT).json({
//                 success: false,
//                 message: `${getStatusText(CONFLICT)}. ${Constants.parse(
//                     Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
//                     Constants.Controllers.TypeNames.REL_CATEGORY
//                 )}`
//             });
//         }
//     } catch (error) {
//         console.log(error)
//         logger.error(error, '');
//         return response.status(INTERNAL_SERVER_ERROR).send({
//             success: false,
//             message: `${getStatusText(INTERNAL_SERVER_ERROR)}.
//                     ${Constants.parse(
//                         Constants.Controllers.ErrorMessages.COULD_NOT_GET,
//                         Constants.Controllers.TypeNames.REL_CATEGORY.toLowerCase()
//                     )}`
//         });
//     }
// };

const deleteCategoryRelation = async function(request, response) {
    try {
        await CategoryRelation.delete({
            guid: request.params.categoryRelationId
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

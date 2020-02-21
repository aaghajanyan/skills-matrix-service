const {
    OK,
    INTERNAL_SERVER_ERROR,
    ACCEPTED,
    CONFLICT,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Category = require('../models/category');
const CategoryRelation = require('../models/categoryRelation');
const logger = require('../helper/logger');

/**
 * @swagger
 * /categories_relations:
 *  get:
 *      summary: Get all categories relations
 *      tags: [Category relation]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get categories relations.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCategoriesRelations = async (_, response) => {
    try {
        const categoriesRelations = await CategoryRelation.findAll();
        return response.status(OK).json(categoriesRelations);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.REL_CATEGORIES.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /categories_relations/{category_relation_id}:
 *  get:
 *      summary: Get category relation by id
 *      tags: [Category relation]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_relation_id
 *            description: GUID of category relation to return
 *            required: true
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get category relation by id.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCategoryRelation = async (request, response) => {
    try {
        const categoryRelation = await CategoryRelation.find({
            guid: request.params.categoryRelationId,
        });
        return response.status(OK).json(categoryRelation);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.REL_CATEGORY.toLowerCase(),
                    request.params.categoryRelationId
                )
            );
    }
};

/**
 * @swagger
 * /categories_relations:
 *   post:
 *     summary: Add new category relation
 *     tags: [Category relation]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Category relation object that needs to be added
 *         schema:
 *           $ref: '#/definitions/categoryRelation'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new category relation.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addCategoryRelation = async (request, response) => {
    try {
        const category = await Category.findByPk(request.body.category_id);
        if (category) {
            const existingCategory = await Category.findByPk(
                request.body.related_category_id
            );
            if (existingCategory) {
                const categoryRelation = await CategoryRelation.create(
                    request.body
                );
                return response
                    .status(CREATED)
                    .json({ id: categoryRelation.id });
            } else {
                return response
                    .status(CONFLICT)
                    .json(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.REL_CATEGORY.toLowerCase(),
                            request.body.related_category_id
                        )
                    );
            }
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.CATEGORY.toLowerCase(),
                        request.body.category_id
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase(),
                    request.body.category_id
                )
            );
    }
};

/**
 * @swagger
 * /categories_relations/{category_relation_id}:
 *  put:
 *      summary: Update category relation by id
 *      tags: [Category relation]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_relation_id
 *            required: true
 *          - in: body
 *            name: body
 *            description: Category relation object that needs to be updated
 *            schema:
 *              $ref: '#/definitions/updateCategoryRelation'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not update category relation.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateCategoryRelation = async (request, response) => {
    try {
        await CategoryRelation.update(request.body, {
            category_id: request.params.categoryRelationId,
        });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.REL_CATEGORY.toLowerCase(),
                    request.params.categoryRelationId
                )
            );
    }
};

/**
 * @swagger
 * /categories_relations/{category_relation_id}:
 *  delete:
 *      summary: Delete category relation by id
 *      tags: [Category relation]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_relation_id
 *            description: Category guid to delete
 *            required: true
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted.
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not delete category relation.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteCategoryRelation = async (request, response) => {
    try {
        await CategoryRelation.delete({
            guid: request.params.categoryRelationId,
        });
        return response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .send(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.REL_CATEGORY.toLowerCase(),
                    request.params.categoryRelationId
                )
            );
    }
};

const { OK, INTERNAL_SERVER_ERROR, ACCEPTED } = require('http-status-codes');
const {
    category: categoryModel,
    skill: skillModel,
    categories_relation: categoryRelationModel,
    skills_relation: skillRelationModel,
} = require('../sequelize/models');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const Category = require('../models/category');
const logger = require('../helper/logger');

/**
 * @swagger
 * /categories:
 *  get:
 *      description: Get categories.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCategories = async (_, response) => {
    try {
        const categories = await Category.findAll();
        return response.status(OK).json(categories);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.CATEGORIES.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /categories/{category_guid}:
 *  get:
 *      description: Get category by guid.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_guid
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
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCategory = async (request, response) => {
    try {
        const category = await Category.find({ guid: request.params.guid });
        response.status(OK).json(category);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /categories/{category_guid}:
 *  put:
 *      description: Update category by guid.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_guid
 *            required: true
 *          - in: body
 *            name: category body
 *            description: Update category.
 *            schema:
 *              $ref: '#/definitions/updateCategory'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateCategory = async (request, response) => {
    try {
        await Category.update(request.body, { guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /categories/{category_guid}:
 *  delete:
 *      description: Delete category by guid.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_guid
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
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteCategory = async (request, response) => {
    try {
        await Category.delete({ guid: request.params.guid });
        response.status(ACCEPTED).json({ success: true });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase(),
                    request.params.guid
                )
            );
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

/**
 * @swagger
 * /categories/all:
 *  get:
 *      description: Get categories all data.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCategoriesAllData = async (_, response) => {
    try {
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
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.CATEGORIES.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /categories/all/{category_guid}:
 *  get:
 *      description: Get category all data.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_guid
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
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getCategoryAllData = async (request, response) => {
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
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase(),
                    request.params.guid
                )
            );
    }
};

/**
 * @swagger
 * /categories:
 *   post:
 *     description: Add new category
 *     tags: [Categories]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: category body
 *         description: Add new category.
 *         schema:
 *           $ref: '#/definitions/addCategory'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add new branch.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addCategory = async (request, response) => {
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
            return response
                .status(OK)
                .json(
                    responseBuilder.alreadyExistsCriteria(
                        Constants.TypeNames.CATEGORY.toLowerCase(),
                        category.name
                    )
                );
        }
        await Category.addRelatedCategories(
            relatedCategoriesIds,
            category,
            sendedList
        );
        await Category.addSkills(skillsIds, category, sendedList);
        return response.status(201).json({
            [Constants.Keys.name]: category.name,
            [Constants.Keys.guid]: category.guid,
            [Constants.Keys.addRelatedCategories]: sendedList.addedCategories,
            [Constants.Keys.addedSkills]: sendedList.addedSkills,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotAddCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /categories/all/{category_guid}:
 *  put:
 *      description: Update category all data.
 *      tags: [Categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: category_guid
 *            required: true
 *          - in: body
 *            name: category body
 *            description: Update category.
 *            schema:
 *              $ref: '#/definitions/updateCategoryAllData'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get branch.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.updateCategoryAllData = async (request, response) => {
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
            return response
                .status(OK)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.CATEGORY.toLowerCase(),
                        request.params.guid
                    )
                );
        }

        if (existingCategory && existingCategory.name !== categoryData.name) {
            await Category.update(categoryData, { guid: request.params.guid });
        }
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
            [Constants.Keys.addRelatedCategories]: sendedList.addedCategories,
            [Constants.Keys.removedRelatedCategories]:
                sendedList.removedCategories,
            [Constants.Keys.addedSkills]: sendedList.addedSkills,
            [Constants.Keys.removedSkills]: sendedList.removedSkills,
        });
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.alreadyExistsCriteria(
                    Constants.TypeNames.CATEGORY.toLowerCase()
                )
            );
    }
};

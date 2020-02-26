const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const responseBuilder = require('../helper/errorResponseBodyBuilder');
const User = require('../models/user');
const Category = require('../models/category');
const UserCategory = require('../models/usersCategories');
const CategoryHistory = require('../models/categoriesHistory');
const logger = require('../helper/logger');

/**
 * @swagger
 * /users_categories:
 *  get:
 *      summary: Get users categories
 *      tags: [User categories]
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized.
 *          500:
 *              description: Could not get users categories.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getUsersCategories = async (_, response) => {
    try {
        const usersCategories = await UserCategory.findAll();
        response.status(OK).json(usersCategories);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.USER_CATEGORIES.toLowerCase()
                )
            );
    }
};

/**
 * @swagger
 * /users_categories/{user_category_guid}:
 *  get:
 *      summary: Get user categories by category guid
 *      tags: [User categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: user_category_guid
 *            description: GUID of user category to return
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
 *              description: Could not get user categories.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.getUserCategories = async (request, response) => {
    try {
        const userCategories = await UserCategory.find({
            guid: request.params.userCategoryGuid,
        });
        return response.status(OK).json(userCategories);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotGetCriteria(
                    Constants.TypeNames.USER_CATEGORIES.toLowerCase(),
                    request.params.userCategoryGuid
                )
            );
    }
};

/**
 * @swagger
 * /users_categories/{user_guid}:
 *   post:
 *     summary: Add category for user
 *     tags: [User categories]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_guid
 *         required: true
 *       - in: body
 *         name: body
 *         description: Category object that needs to be added for user
 *         schema:
 *           $ref: '#/definitions/userCategoriesArray'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Could not add user category.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.addUserCategory = async (request, response) => {
    const expectedResponse = {
        errors: [],
        items: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const { categories } = request.body;
            const promise = categories.map(async category => {
                const existingCategory = await Category.find({
                    guid: category.categoryGuid,
                });
                if (existingCategory) {
                    category.user_id = user.id;
                    category.category_id = existingCategory.id;
                    try {
                        const userCategoryData = await UserCategory.find({
                            user_id: user.id,
                            category_id: existingCategory.id,
                        });
                        if (userCategoryData) {
                            await addUserCategoryAndUpdateHistory(
                                userCategoryData,
                                user,
                                category
                            );
                            status = OK;
                            expectedResponse.items.push(userCategoryData);
                        } else {
                            const userCategory = await UserCategory.create(
                                category
                            );
                            status = CREATED;
                            expectedResponse.items.push(userCategory);
                        }
                    } catch (error) {
                        expectedResponse.errors.push(
                            responseBuilder.alreadyExistsCriteria(
                                Constants.TypeNames.USER_CATEGORY.toLowerCase(),
                                existingCategory.name
                            )
                        );
                    }
                } else {
                    expectedResponse.errors.push(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.CATEGORY,
                            category.categoryGuid
                        )
                    );
                }
            });
            await Promise.all(promise).catch(err => logger.error(err));
            return response.status(status).json({ expectedResponse });
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.params.userGuid
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        response.status(INTERNAL_SERVER_ERROR).json(
            responseBuilder.couldNotAddCriteria(
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            ) // TODO
        );
    }
};

const addUserCategoryAndUpdateHistory = async (
    userCategoryData,
    user,
    existingCategory
) => {
    const dataValues = userCategoryData.dataValues;
    dataValues.created_date = new Date();
    delete dataValues.guid;
    await CategoryHistory.findOrCreate(dataValues, {
        user_id: user.id,
        category_id: existingCategory.category_id,
        experience: userCategoryData.experience,
        profficience: userCategoryData.profficience,
    });
    await UserCategory.update(existingCategory, {
        user_id: user.id,
        category_id: existingCategory.category_id,
    });
};

/**
 * @swagger
 * /users_categories/{user_guid}:
 *   put:
 *     summary: Update user category by user id
 *     tags: [User categories]
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: user_guid
 *         required: true
 *       - in: body
 *         name: body
 *         description: Category object that needs to be updated for user
 *         schema:
 *           $ref: '#/definitions/userCategoriesArray'
 *
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Conflict.
 *       500:
 *         description: Could not add user category.
 *
 *     security:
 *       - bearerAuth: []
 *
 */
module.exports.updateUserCategory = async (request, response) => {
    const expectedResponse = {
        errors: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const { categories } = request.body;
            const promise = categories.map(async category => {
                const existingCategory = await Category.find({
                    guid: category.categoryGuid,
                });
                if (existingCategory) {
                    await UserCategory.update(category, {
                        user_id: user.id,
                        category_id: existingCategory.id,
                    });
                    status = OK;
                } else {
                    expectedResponse.errors.push(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.CATEGORY,
                            category.categoryGuid
                        )
                    );
                }
            });
            await Promise.all(promise).catch(err => logger.error(err));
            expectedResponse.success = status === CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.params.userGuid
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotUpdateCriteria(
                    Constants.TypeNames.USER_CATEGORY
                )
            );
    }
};

/**
 * @swagger
 * /users_categories/{user_guid}:
 *  delete:
 *      summary: Delete user category by user id
 *      tags: [User categories]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: user_guid
 *            required: true
 *          - in: body
 *            name: body
 *            description: Category object that needs to be removed for user
 *            schema:
 *              $ref: '#/definitions/deleteUserCategory'
 *      schema:
 *          type: string
 *          minimum: 1
 *      responses:
 *          202:
 *              description: Accepted.
 *          401:
 *              description: Unauthorized.
 *          409:
 *              description: Conflict.
 *          500:
 *              description: Could not delete user category.
 *      security:
 *          - bearerAuth: []
 *
 */
module.exports.deleteUserCategory = async (request, response) => {
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const category = await Category.find({
                guid: request.body.categoryGuid,
            });
            if (category) {
                await UserCategory.delete({
                    user_id: user.id,
                    category_id: category.id,
                });
                return response.status(ACCEPTED).json({ success: true });
            } else {
                return response
                    .status(CONFLICT)
                    .json(
                        responseBuilder.doesNotExistCriteria(
                            Constants.TypeNames.CATEGORY,
                            request.body.categoryGuid
                        )
                    );
            }
        } else {
            return response
                .status(CONFLICT)
                .json(
                    responseBuilder.doesNotExistCriteria(
                        Constants.TypeNames.USER,
                        request.body.categoryGuid
                    )
                );
        }
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.USER_CATEGORY.toLowerCase()
                )
            );
    }
};

module.exports.deleteUserCategoryById = async (request, response) => {
    try {
        await UserCategory.delete({ id: request.params.userCategoryGuid });
        return response.status(ACCEPTED).end();
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(
                responseBuilder.couldNotDeleteCriteria(
                    Constants.TypeNames.USER_CATEGORY.toLowerCase()
                )
            );
    }
};

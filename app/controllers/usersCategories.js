const { OK, INTERNAL_SERVER_ERROR, CONFLICT, ACCEPTED, CREATED } = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const User = require('../models/user');
const Category = require('../models/category');
const UserCategory = require('../models/usersCategories');
const logger = require('../helper/logger');
const CategoryHistory = require('../models/categoriesHistory');
const {
    couldNotGetCriteria,
    couldNotUpdateCriteria,
    couldNotAddCriteria,
    couldNotDeleteCriteria,
    elementDoesNotExist,
    alreadyExistsCriteria,
} = require('../helper/errorResponseBodyBuilder');

const getUsersCategories = async function(_, response) {
    try {
        const usersCategories = await UserCategory.findAll();
        response.status(OK).json(usersCategories);
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotGetCriteria(Constants.TypeNames.USER_CATEGORIES.toLowerCase()));
    }
};

const getUserCategories = async function(request, response) {
    try {
        const userCategories = await UserCategory.find({
            guid: request.params.userCategoryGuid,
        });
        return response.status(OK).json(userCategories);
    } catch (error) {
        logger.error(error);
        return response
            .status(INTERNAL_SERVER_ERROR)
            .json(couldNotGetCriteria(Constants.TypeNames.USER_CATEGORIES.toLowerCase(), request.params.userCategoryGuid));
    }
};

const addUserCategory = async function(request, response) {
    const expectedResponse = {
        errors: [],
        items: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const { categories } = request.body;
            for (category of categories) {
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
                            await addUserCategoryAndUpdateHistory(userCategoryData, user, existingCategory);
                            status = OK;
                            expectedResponse.items.push(userCategoryData);
                        } else {
                            const userCategory = await UserCategory.create(category);
                            status = CREATED;
                            expectedResponse.items.push(userCategory);
                        }
                    } catch (error) {
                        expectedResponse.errors.push(alreadyExistsCriteria(Constants.TypeNames.USER_CATEGORY.toLowerCase()));
                    }
                } else {
                    expectedResponse.errors.push(elementDoesNotExist(Constants.TypeNames.CATEGORY, category.categoryGuid));
                }
            }
            return response.status(status).json({ expectedResponse });
        } else {
            return response.status(CONFLICT).json(elementDoesNotExist(Constants.TypeNames.USER, request.params.userGuid));
        }
    } catch (error) {
        console.log(error);
        logger.error(error);
        response.status(INTERNAL_SERVER_ERROR).json(
            couldNotAddCriteria(Constants.TypeNames.USER_CATEGORY.toLowerCase()) // TODO
        );
    }
};

const addUserCategoryAndUpdateHistory = async function(userCategoryData, user, existingCategory) {
    const dataValues = userCategoryData.dataValues;
    dataValues.created_date = new Date();
    delete dataValues.guid;
    await CategoryHistory.findOrCreate(dataValues, {
        user_id: user.id,
        category_id: existingCategory.id,
        experience: userCategoryData.experience,
        profficience: userCategoryData.profficience,
    });
    await UserCategory.update(category, {
        user_id: user.id,
        category_id: existingCategory.id,
    });
};

const updateUserCategory = async function(request, response) {
    const expectedResponse = {
        errors: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.params.userGuid });
        if (user) {
            const { categories } = request.body;
            for (category of categories) {
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
                    expectedResponse.errors.push(elementDoesNotExist(Constants.TypeNames.CATEGORY, category.categoryGuid));
                }
            }
            expectedResponse.success = status === CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response.status(CONFLICT).json(elementDoesNotExist(Constants.TypeNames.USER, request.params.userGuid));
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotUpdateCriteria(Constants.TypeNames.USER_CATEGORY));
    }
};

const deleteUserCategory = async function(request, response) {
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
                return response.status(CONFLICT).json(elementDoesNotExist(Constants.TypeNames.CATEGORY, request.body.categoryGuid));
            }
        } else {
            return response.status(CONFLICT).json(elementDoesNotExist(Constants.TypeNames.USER, request.body.categoryGuid));
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotDeleteCriteria(Constants.TypeNames.USER_CATEGORY.toLowerCase()));
    }
};

const deleteUserCategoryById = async function(request, response) {
    try {
        await UserCategory.delete({ id: request.params.userCategoryGuid });
        return response.status(ACCEPTED).end();
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json(couldNotDeleteCriteria(Constants.TypeNames.USER_CATEGORY.toLowerCase()));
    }
};

module.exports = {
    getUserCategories,
    getUsersCategories,
    addUserCategory,
    updateUserCategory,
    deleteUserCategory,
    deleteUserCategoryById,
};

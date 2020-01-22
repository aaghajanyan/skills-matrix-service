const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED
} = require('http-status-codes');
const { Constants } = require('../constants/Constants');
const User = require('../models/user');
const Category = require('../models/category');
const UserCategory = require('../models/users-categories');
const logger = require('../helper/logger');
const ErrorMessageParser = require('../errors/ErrorMessageParser');

const getUsersCategories = async function(_, response) {
    try {
        const usersCategories = await UserCategory.findAll();
        response.status(OK).json(usersCategories);
    } catch (error) {
        logger.error(error);
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
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
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_GET,
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const addUserCategory = async function(request, response) {
    const expectedResponse = {
        errors: [],
        items: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.body.userGuid });
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
                        const userCategory = await UserCategory.create(
                            category
                        );
                        status = CREATED;
                        expectedResponse.items.push(userCategory);
                    } catch (error) {
                        expectedResponse.errors.push({
                            success: false,
                            error: ErrorMessageParser.stringFormatter(Constants.Controllers.UserCategory.ALREADY_EXISTS,
                                existingCategory.name,
                                user.guid)
                        });
                    }
                } else {
                    expectedResponse.errors.push({
                        success: false,
                        error: `${ErrorMessageParser.elementDoesNotExist(
                            Constants.TypeNames.CATEGORY,
                            category.categoryGuid,
                            Constants.Keys.guid
                        )}`,
                    });
                }
            }
            return response.status(status).json({ expectedResponse });
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_ADD,
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const updateUserCategory = async function(request, response) {
    const expectedResponse = {
        errors: [],
    };
    let status = CONFLICT;
    try {
        const user = await User.findOne({ guid: request.body.userGuid });
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
                    expectedResponse.errors.push({
                        success: false,
                        error: `${ErrorMessageParser.elementDoesNotExist(
                            Constants.TypeNames.CATEGORY,
                            category.categoryGuid,
                            Constants.Keys.guid
                        )}`,
                    });
                }
            }
            expectedResponse.success = status === CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_UPDATE,
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const deleteUserCategory = async function(request, response) {
    try {
        const user = await User.findOne({ guid: request.body.userGuid });
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
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${ErrorMessageParser.stringFormatter(
                        Constants.ErrorMessages.COULD_NOT_DELETE,
                        Constants.TypeNames.USER_CATEGORY.toLowerCase()
                    )}. ${ErrorMessageParser.stringFormatter(
                        Constants.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.TypeNames.SKILL
                    )}`,
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.COULD_NOT_DELETE,
                    Constants.TypeNames.USER_CATEGORY.toLowerCase()
                )} ${ErrorMessageParser.stringFormatter(
                    Constants.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_DELETE,
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const deleteUserCategoryById = async function(request, response) {
    try {
        await UserCategory.delete({ id: request.params.userCategoryGuid });
        return response.status(ACCEPTED).end();
    } catch (error) {
        logger.error(error);
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${ErrorMessageParser.stringFormatter(
                Constants.ErrorMessages.COULD_NOT_DELETE,
                Constants.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
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

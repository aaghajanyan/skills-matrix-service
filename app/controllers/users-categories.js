const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
    getStatusText,
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
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
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
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const addUserCategory1 = async function(request, response) {
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const category = await Category.find({
                guid: request.body.categoryGuid,
            });
            if (category) {
                category.user_id = user.id;
                category.category_id = category.id;
                const userCategory = await UserCategory.create(category);
                return response.status(CREATED).json({ userCategory });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${getStatusText(
                        INTERNAL_SERVER_ERROR
                    )}. ${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.CATEGORY
                    )}`,
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    INTERNAL_SERVER_ERROR
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
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
        const user = await User.findOneUser({ guid: request.body.userGuid });
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
                            error: `${ErrorMessageParser.stringFormatter(
                                Constants.Controllers.UserCategory
                                    .ALREADY_EXISTS,
                                category.categoryGuid
                            )}`,
                        });
                    }
                } else {
                    expectedResponse.errors.push({
                        success: false,
                        error: `${ErrorMessageParser.elementDoesNotExist(
                            Constants.Controllers.TypeNames.CATEGORY,
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
                message: `${getStatusText(
                    CONFLICT
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
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
        const user = await User.findOneUser({ guid: request.body.userGuid });
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
                            Constants.Controllers.TypeNames.CATEGORY,
                            category.categoryGuid,
                            Constants.Keys.guid
                        )}`,
                    });
                }
            }
            expectedResponse.success = status == CONFLICT ? false : true;
            return response.status(status).json(expectedResponse);
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    CONFLICT
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const deleteUserCategory = async function(request, response) {
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
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
                    message: `${getStatusText(
                        CONFLICT
                    )}. ${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                        Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
                    )}. ${ErrorMessageParser.stringFormatter(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.SKILL
                    )}`,
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    CONFLICT
                )}. ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                    Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
                )} ${ErrorMessageParser.stringFormatter(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`,
            });
        }
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`,
        });
    }
};

const deleteUserCategoryById = async function(request, response) {
    try {
        await UserCategory.delete({ id: request.params.userCategoryGuid });
        return response.status(ACCEPTED).end();
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${ErrorMessageParser.stringFormatter(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
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

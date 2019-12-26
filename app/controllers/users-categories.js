const {
    OK,
    INTERNAL_SERVER_ERROR,
    CONFLICT,
    ACCEPTED,
    CREATED,
    getStatusText
} = require("http-status-codes");
const { Constants } = require("../constants/Constants");
const User = require("../models/user");
const Category = require("../models/category");
const UserCategory = require("../models/users-categories");
const logger = require("../helper/logger");

const getUsersCategories = async function(_, response) {
    try {
        const usersCategories = await Category.findAll();
        response.status(OK).json(usersCategories);
    } catch (error) {
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`
        });
    }
};

const getUserCategories = async function(request, response) {
    try {
        const userCategories = await UserCategory.find({
            guid: request.params.userCategoryGuid
        });
        return response.status(OK).json(userCategories);
    } catch (error) {
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_GET,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`
        });
    }
};

const addUserCategory = async function(request, response) {
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const category = await Category.find({
                guid: request.body.categoryGuid
            });
            if (category) {
                const obj = request.body;
                obj.userId = user.id;
                obj.categoryId = category.id;
                const userCategory = await UserCategory.create(obj);
                return response.status(CREATED).json({ userCategory });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${getStatusText(
                        INTERNAL_SERVER_ERROR
                    )}. ${Constants.parse(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.CATEGORY
                    )}`
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(
                    INTERNAL_SERVER_ERROR
                )}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`
            });
        }
    } catch (error) {
        logger.error(error, '');
        response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_ADD,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`
        });
    }
};

const updateUserCategory = async function(request, response) {
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const category = await Category.find({
                guid: request.body.categoryGuid
            });
            if (category) {
                await UserCategory.update(request.body, {
                    userId: user.id,
                    categoryId: category.id
                });
                return response.status(ACCEPTED).json({ success: true });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.CATEGORY
                    )}`
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`
            });
        }
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_UPDATE,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`
        });
    }
};

const deleteUserCategory = async function(request, response) {
    try {
        const user = await User.findOneUser({ guid: request.body.userGuid });
        if (user) {
            const category = await Category.find({
                guid: request.body.categoryGuid
            });
            if (category) {
                await UserCategory.delete({
                    userId: user.id,
                    categoryId: category.id
                });
                return response.status(ACCEPTED).json({ success: true });
            } else {
                return response.status(CONFLICT).json({
                    success: false,
                    message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                        Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                        Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
                    )}. ${Constants.parse(
                        Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                        Constants.Controllers.TypeNames.SKILL
                    )}`
                });
            }
        } else {
            return response.status(CONFLICT).json({
                success: false,
                message: `${getStatusText(CONFLICT)}. ${Constants.parse(
                    Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                    Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
                )} ${Constants.parse(
                    Constants.Controllers.ErrorMessages.DOES_NOT_EXSTS,
                    Constants.Controllers.TypeNames.USER
                )}`
            });
        }
    } catch (error) {
        logger.error(error, '');
        return response.status(INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `${getStatusText(
                INTERNAL_SERVER_ERROR
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`
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
            )}. ${Constants.parse(
                Constants.Controllers.ErrorMessages.COULD_NOT_DELETE,
                Constants.Controllers.TypeNames.USER_CATEGORY.toLowerCase()
            )}`
        });
    }
};

module.exports = {
    getUserCategories,
    getUsersCategories,
    addUserCategory,
    updateUserCategory,
    deleteUserCategory,
    deleteUserCategoryById
};

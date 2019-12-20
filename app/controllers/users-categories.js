const {
    user: userModel,
    category: categoryModel,
    "users_categories": usersCategoriesModel
} = require("../sequelize/models");

const getUsersCategories = async function(_, response) {
    try {
        const usersCategories = await categoryModel.findAll();
        response.status(200).json(usersCategories);
    } catch (err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not get user categories`
        });
    }

};

const getUserCategories = async function(request, response) {
    try {
        const userCategories = await usersCategoriesModel.findOne({
            where: { guid: request.params.userCategoryGuid }
        });
        response.status(200).json(userCategories);
    } catch (err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not get users categories`
        });;
    }
};

const addUserCategory =  async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { guid: request.body.userGuid }
        });

        if (user) {
            const category = await categoryModel.findOne({
                where: { guid: request.body.categoryGuid }
            });
            if (category) {
                const obj = request.body;
                obj.userId = user.id;
                obj.categoryId = category.id;
                const userCategory = await usersCategoriesModel.create(obj);
                return response.status(201).json({ userCategory })
            } else {
                return response.status(409).json({
                    success: false,
                    message: `Category doesn't exist`
                });
            }
        } else {
            return response.status(409).json({
                success: false,
                message: `User doesn't exist`
            });
        }
    } catch (err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not add user categories`
        });;
    }
};

const updateUserCategory =  async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { guid: request.body.userGuid }
        });
        if (user) {
            const category = await skillModel.findOne({
                where: { guid: request.body.categoryGuid }
            });
            if (category) {
                await usersCategoriesModel.update(request.body, {
                    where: { userId: user.id, categoryId: category.id }
                });
                return response.status(202).end();
            } else {
                return response.status(409).json({
                    success: false,
                    message: `Category doesn't exist`
                });
            }
        } else {
            return response.status(409).json({
                success: false,
                message: `User doesn't exist`
            });
        }
    } catch(err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not update user categories`
        });;
    }
};

const deleteUserCategory =  async function(request, response) {
    try {
        const user = await userModel.findOne({
            where: { guid: request.body.userGuid }
        });
        if (user) {
            const skill = await skillModel.findOne({
                where: { guid: request.body.skillGuid }
            });
            if (category) {
                await usersCategoriesModel.destroy({ where: { userId: user.id, categoryId: category.id } });
                return response.status(202).end();
            } else {
                return response.status(409).json({
                    success: false,
                    message: `Could not delete item. Skill doesn't exist`
                });
            }
        } else {
            return response.status(409).json({
                success: false,
                message: `Could not delete item. User doesn't exist`
            });
        }
    } catch(err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not delete user category`
        });;
    }
};

const deleteUserCategoryById =  async function(request, response) {
    try {
        await usersCategoriesModel.destroy({ where: { id: request.params.userCategoryGuid } });
        response.status(202).end();
    } catch(err) {
        console.log(err);
        response.status(409).json({
            success: false,
            message: `Could not delete user category`
        });;
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

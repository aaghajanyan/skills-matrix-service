const express = require('express');
const {
    getUserCategories,
    getUsersCategories,
    addUserCategory,
    updateUserCategory,
    deleteUserCategory,
    deleteUserCategoryById,
} = require('../controllers/usersCategories');
const { validateAddBody, validateUpdateBody } = require('../validation/usersCategories');
const { verifyLoginToken, verifyRightPermission } = require('../validation/token');

const router = express.Router();

router.get('/', verifyLoginToken, getUsersCategories);
router.get('/:userCategoryGuid', verifyLoginToken, getUserCategories);
router.post('/:userGuid', verifyLoginToken, verifyRightPermission, validateAddBody, addUserCategory);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, updateUserCategory);
router.delete('/:userGuid', verifyLoginToken, deleteUserCategory);
// router.delete('/:userCategoryGuid', verifyLoginToken, verifyRightPermission, deleteUserCategoryById);

module.exports = router;

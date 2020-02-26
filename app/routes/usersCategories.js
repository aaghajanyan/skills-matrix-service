const express = require('express');
const router = express.Router();

const {getUserCategories, getUsersCategories, addUserCategory, deleteUserCategory} = require('../controllers/usersCategories');
const {validateAddBody, validateUpdateBody} = require('../validation/usersCategories');
const {verifyLoginToken, verifyRightPermission} = require('../validation/token');


router.get('/', verifyLoginToken, getUsersCategories);
router.get('/:userCategoryGuid', verifyLoginToken, getUserCategories);
router.post('/:userGuid', verifyLoginToken, verifyRightPermission, validateAddBody, addUserCategory);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, addUserCategory);
router.delete('/:userGuid', verifyLoginToken, deleteUserCategory);
// router.delete('/:userCategoryGuid', verifyLoginToken, verifyRightPermission, deleteUserCategoryById);

module.exports = router;

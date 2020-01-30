const express = require('express');
const router = express.Router();

const {getUserCategories, getUsersCategories, addUserCategory, updateUserCategory, deleteUserCategory
} = require('../controllers/usersCategories');
const {validateAddBody, validateUpdateBody} = require('../validation/usersCategories');
const {verifyLoginToken, verifyRightPermission} = require('../validation/token');


router.get('/', verifyLoginToken, getUsersCategories);
router.get('/:userCategoryGuid', verifyLoginToken, getUserCategories);
router.post('/:userGuid', verifyLoginToken, verifyRightPermission, validateAddBody, addUserCategory);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, updateUserCategory);
router.delete('/:userGuid', verifyLoginToken, deleteUserCategory);

module.exports = router;

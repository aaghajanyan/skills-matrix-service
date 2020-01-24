const express = require('express');
const {
    getCategories,
    getCategory,
    addCategory,
    updateCategory,
    updateCategoryAllData,
    deleteCategory,
    getCategoriesAllData,
    getCategoryAllData,
} = require('../controllers/category');
const { validateAddBody, validateUpdateBody } = require('../validation/categories');
const { verifyLoginToken } = require('../validation/token');
const { verifyPermissions } = require('../validation/permissions');

const router = express.Router();

router.get('/', verifyLoginToken, getCategories);
router.get('/all', verifyLoginToken, getCategoriesAllData);
router.get('/all/:guid', verifyLoginToken, getCategoryAllData);
router.get('/:guid', verifyLoginToken, getCategory);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addCategory);
router.put('/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updateCategory);
router.put('/all/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updateCategoryAllData);
router.delete('/:guid', verifyLoginToken, verifyPermissions, deleteCategory);

module.exports = router;

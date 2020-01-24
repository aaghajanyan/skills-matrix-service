const express = require('express');
const router = express.Router();

const {getCategoriesRelations, getCategoryRelation, addCategoryRelation, updateCategoryRelation, deleteCategoryRelation} = require('../controllers/categoryRelation');
const {validateAddBody, validateUpdateBody} = require('../validation/categoriesRelations');
const {verifyLoginToken} = require('../validation/token');
const {verifyPermissions} = require('../validation/permissions');

router.get('/', verifyLoginToken, getCategoriesRelations);
router.get('/:categoryRelationId', verifyLoginToken, getCategoryRelation);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addCategoryRelation);
router.put('/:categoryRelationId', verifyLoginToken, verifyPermissions, validateUpdateBody, updateCategoryRelation);
router.delete('/:categoryRelationId', verifyLoginToken, verifyPermissions, deleteCategoryRelation);

module.exports = router;

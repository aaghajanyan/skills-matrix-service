const express = require("express");
const {
    getCategoriesRelations,
    getCategoryRelation,
    addCategoryRelation,
    updateCategoryRelation,
    deleteCategoryRelation
} = require("../controllers/category-relation");
const { validateAddBody, validateUpdateBody } = require("../validation/categories-relations");
const { verifyLoginToken } = require('../validation/token');
const { verifyPermissions } = require('../validation/permissions');

const router = express.Router();

router.get("/", verifyLoginToken, getCategoriesRelations);
router.get("/:categoryRelationId", verifyLoginToken, getCategoryRelation);
router.post("/", verifyLoginToken, verifyPermissions, validateAddBody, addCategoryRelation);
router.put("/:categoryRelationId", verifyLoginToken, verifyPermissions, validateUpdateBody, updateCategoryRelation);
router.delete("/:categoryRelationId", verifyLoginToken, verifyPermissions, deleteCategoryRelation);

module.exports = router;

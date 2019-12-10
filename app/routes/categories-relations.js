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

const router = express.Router();

router.get("/", verifyLoginToken, getCategoriesRelations);
router.get("/:categoryRelationId", verifyLoginToken, getCategoryRelation);
router.post("/", verifyLoginToken, validateAddBody, addCategoryRelation);
router.put("/:categoryRelationId", verifyLoginToken, validateUpdateBody, updateCategoryRelation);
router.delete("/:categoryRelationId", verifyLoginToken, deleteCategoryRelation);

module.exports = router;

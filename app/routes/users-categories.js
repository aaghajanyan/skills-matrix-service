const express = require("express");
const {
    getUserCategories,
    getUsersCategories,
    addUserCategory,
    updateUserCategory,
    deleteUserCategory,
    deleteUserCategoryById
} = require("../controllers/users-categories");
const { validateAddBody, validateUpdateBody } = require("../validation/users-categories");
const { verifyLoginToken } = require('../validation/token');

const router = express.Router();

router.get("/", verifyLoginToken, getUsersCategories);
router.get("/:userCategoryGuid", verifyLoginToken, getUserCategories);
router.post("/", verifyLoginToken, validateAddBody, addUserCategory);
router.put("/", verifyLoginToken, validateUpdateBody, updateUserCategory);
router.delete("/:userCategoryGuid", verifyLoginToken, deleteUserCategoryById);
router.delete("/", verifyLoginToken, deleteUserCategory);

module.exports = router;

const express = require("express");
const users = require("./users");
const invitations = require("./invitations");
const categories = require("./categories");
const categoriesRelations = require("./categories-relations");
const skills = require("./skills");
const skillsRelations = require("./skills-relations");
const roleGroup = require("./roles-groups");
const forgotPassword = require("./forgot-password");
const usersSkills = require("./users-skills");
const usersCategories = require("./users-categories");
const search = require("./search");
const criteria = require("./criteria");
const branch = require("./branch");
const position = require("./position");

const router = express.Router();

router.use("/users", users);
router.use("/invitations", invitations);
router.use("/categories", categories);
router.use("/categories-relations", categoriesRelations);
router.use("/skills", skills);
router.use("/skills-relations", skillsRelations);
router.use("/role_group", roleGroup);
router.use("/forgot_password", forgotPassword);
router.use("/users_skills", usersSkills);
router.use("/users_categories", usersCategories);
router.use("/search", search);
router.use("/criteria", criteria);
router.use("/branch", branch);
router.use("/position", position);

module.exports = router;

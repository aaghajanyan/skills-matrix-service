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


module.exports = router;

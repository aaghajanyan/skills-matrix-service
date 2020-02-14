const express = require('express');
const router = express.Router();

const users = require('./users');
const invitations = require('./invitations');
const categories = require('./categories');
const categoriesRelations = require('./categoriesRelations');
const skills = require('./skills');
const skillsRelations = require('./skillsRelations');
const roleGroup = require('./rolesGroups');
const forgotPassword = require('./forgotPassword');
const usersSkills = require('./usersSkills');
const usersCategories = require('./usersCategories');
const search = require('./search');
const criteria = require('./criteria');
const branch = require('./branch');
const position = require('./position');
const profficience = require('./profficience');

router.use('/users', users);
router.use('/invitations', invitations);
router.use('/categories', categories);
router.use('/categories_relations', categoriesRelations);
router.use('/skills', skills);
router.use('/skills_relations', skillsRelations);
router.use('/role_group', roleGroup);
router.use('/forgot_password', forgotPassword);
router.use('/users_skills', usersSkills);
router.use('/users_categories', usersCategories);
router.use('/search', search);
router.use('/criteria', criteria);
router.use('/branch', branch);
router.use('/position', position);
router.use('/profficience', profficience);

module.exports = router;

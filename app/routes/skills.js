const express = require('express');
const router = express.Router();

const {getSkills, getSkill, getSkillAllData, getSkillsAllData, addSkill, updateSkill, updateSkillAllData, deleteSkill} = require('../controllers/skill');
const {validateAddBody, validateUpdateBody} = require('../validation/skills');
const {verifyLoginToken} = require('../validation/token');
const {verifyPermissions} = require('../validation/permissions');

router.get('/', verifyLoginToken, getSkills);
router.get('/all', verifyLoginToken, getSkillsAllData);
router.get('/:guid', verifyLoginToken, getSkill);
router.get('/all/:guid', verifyLoginToken, getSkillAllData);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addSkill);
router.put('/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updateSkill);
router.put('/all/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updateSkillAllData);
router.delete('/:guid', verifyLoginToken, verifyPermissions, deleteSkill);

module.exports = router;

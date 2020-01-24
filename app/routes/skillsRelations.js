const express = require('express');
const router = express.Router();

const {getSkillsRelations, getSkillRelation, addSkillRelation, updateSkillRelation, deleteSkillRelation} = require('../controllers/skillRelation');
const {validateAddBody, validateUpdateBody} = require('../validation/skillsRelations');
const {verifyLoginToken} = require('../validation/token');
const {verifyPermissions} = require('../validation/permissions');

router.get('/', verifyLoginToken, getSkillsRelations);
router.get('/:skillRelationId', verifyLoginToken, getSkillRelation);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addSkillRelation);
router.put('/:skillRelationId', verifyLoginToken, verifyPermissions, validateUpdateBody, updateSkillRelation);
router.delete('/:skillRelationId', verifyLoginToken, verifyPermissions, deleteSkillRelation);

module.exports = router;

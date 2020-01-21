const express = require('express');
const {
    getSkillsRelations,
    getSkillRelation,
    addSkillRelation,
    updateSkillRelation,
    deleteSkillRelation,
} = require('../controllers/skill-relation');
const {
    validateAddBody,
    validateUpdateBody,
} = require('../validation/skills-relations');
const { verifyLoginToken } = require('../validation/token');
const { verifyPermissions } = require('../validation/permissions');
const router = express.Router();

router.get('/', verifyLoginToken, getSkillsRelations);
router.get('/:skillRelationId', verifyLoginToken, getSkillRelation);
router.post(
    '/',
    verifyLoginToken,
    verifyPermissions,
    validateAddBody,
    addSkillRelation
);
router.put(
    '/:skillRelationId',
    verifyLoginToken,
    verifyPermissions,
    validateUpdateBody,
    updateSkillRelation
);
router.delete(
    '/:skillRelationId',
    verifyLoginToken,
    verifyPermissions,
    deleteSkillRelation
);

module.exports = router;

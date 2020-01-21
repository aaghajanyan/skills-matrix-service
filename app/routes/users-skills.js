const express = require('express');
const {
    getUserSkills,
    getUsersSkills,
    addUserSkill,
    updateUserSkill,
    deleteUserSkill,
    deleteUserSkillById,
} = require('../controllers/users-skills');
const {
    validateAddBody,
    validateUpdateBody,
} = require('../validation/users-skills');
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.get('/', verifyLoginToken, getUsersSkills);
router.get('/:userSkillGuid', verifyLoginToken, getUserSkills);
router.post('/', verifyLoginToken, validateAddBody, addUserSkill);
router.put('/', verifyLoginToken, validateUpdateBody, updateUserSkill);
router.delete('/:userSkillGuid', verifyLoginToken, deleteUserSkillById);
router.delete('/', verifyLoginToken, deleteUserSkill);

module.exports = router;

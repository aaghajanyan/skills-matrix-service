const express = require('express');
const router = express.Router();

const {getUserSkills, getUsersSkills, addUserSkill, deleteUserSkill} = require('../controllers/usersSkills');
const {validateAddBody, validateUpdateBody} = require('../validation/usersSkills');
const {verifyLoginToken, verifyRightPermission} = require('../validation/token');

router.get('/', verifyLoginToken, getUsersSkills);
router.get('/:userSkillGuid', verifyLoginToken, getUserSkills);
router.post('/:userGuid', verifyLoginToken, verifyRightPermission, validateAddBody, addUserSkill);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, addUserSkill);
router.delete('/:userGuid', verifyLoginToken, deleteUserSkill);
// router.delete('/:userSkillGuid', verifyLoginToken, deleteUserSkillById);

module.exports = router;

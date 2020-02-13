const express = require('express');
const router = express.Router();

const {getUserSkills, getUsersSkills, addUserSkill, updateUserSkill, deleteUserSkill, deleteUserSkillById} = require('../controllers/usersSkills');
const {validateAddBody, validateUpdateBody} = require('../validation/usersSkills');
const {verifyLoginToken, verifyRightPermission} = require('../validation/token');

router.get('/', verifyLoginToken, getUsersSkills);
router.get('/:userSkillGuid', verifyLoginToken, getUserSkills);
router.post('/:userGuid', verifyLoginToken, verifyRightPermission, validateAddBody, addUserSkill);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, updateUserSkill);
router.delete('/:userGuid', verifyLoginToken, verifyRightPermission, deleteUserSkill);
// router.delete('/:userSkillGuid', verifyLoginToken, deleteUserSkillById);

module.exports = router;

const express = require('express');
const router = express.Router();

const {getUserSkills, getUsersSkills, addUserSkill, deleteUserSkill, getSkillsHistory} = require('../controllers/usersSkills');
const {validateAddBody, validateUpdateBody} = require('../validation/usersSkills');
const {verifyLoginToken, verifyRightPermission} = require('../validation/token');

router.get('/', verifyLoginToken, getUsersSkills);
router.get('/history/:userGuid', verifyLoginToken, getSkillsHistory);
router.get('/:userSkillGuid', verifyLoginToken, getUserSkills);
router.post('/:userGuid', verifyLoginToken, validateAddBody, addUserSkill);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, addUserSkill);
router.delete('/:userGuid', verifyLoginToken, deleteUserSkill);
// router.delete('/:userSkillGuid', verifyLoginToken, deleteUserSkillById);

module.exports = router;

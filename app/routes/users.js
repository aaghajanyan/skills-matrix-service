const express = require('express');
const router = express.Router();

const {getUsers, getUser, signUp, updateUser, login} = require('../controllers/user');
const {validateAddBody, validateUpdateBody, validateLoginBody} = require('../validation/users');
const {verifyLoginToken, verifyRegisterToken, verifyRightPermission} = require('../validation/token');

router.get('/', verifyLoginToken, getUsers);
router.get('/:userGuid', verifyLoginToken, getUser);
router.put('/:userGuid', verifyLoginToken, verifyRightPermission, validateUpdateBody, updateUser);
router.post('/login', validateLoginBody, login);
router.post('/:token', verifyRegisterToken, validateAddBody, signUp);

module.exports = router;

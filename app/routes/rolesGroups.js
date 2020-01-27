const express = require('express');
const router = express.Router();

const {getRoleGroup, getRoleGroups} = require('../controllers/rolesGroups');
const {verifyLoginToken} = require('../validation/token');

router.get('/', verifyLoginToken, getRoleGroups);
router.get('/:guid', verifyLoginToken, getRoleGroup);

module.exports = router;

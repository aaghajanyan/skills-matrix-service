const express = require('express');
const { getRoleGroup, getRoleGroups } = require('../controllers/roles-groups');
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.get('/', verifyLoginToken, getRoleGroups);
router.get('/:guid', verifyLoginToken, getRoleGroup);

module.exports = router;

const express = require('express');
const router = express.Router();

const {getCriteria, getCriteries, addCriteria, updateCriteria, deleteCriteria} = require('../controllers/criteria');
const {validateAddBody, validateUpdateBody} = require('../validation/criteria');
const {verifyLoginToken} = require('../validation/token');
const {verifyPermissions} = require('../validation/permissions');

router.get('/', verifyLoginToken, getCriteries);
router.get('/:guid', verifyLoginToken, getCriteria);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addCriteria);
router.put('/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updateCriteria);
router.delete('/:guid', verifyLoginToken, verifyPermissions, deleteCriteria);

module.exports = router;

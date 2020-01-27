const express = require('express');
const router = express.Router();

const {getBranch, getBranches, addBranch, updateBranch, deleteBranch} = require('../controllers/branch');
const {validateAddBody, validateUpdateBody} = require('../validation/branch');
const {verifyLoginToken} = require('../validation/token');
const {verifyPermissions} = require('../validation/permissions');

router.get('/', verifyLoginToken, getBranches);
router.get('/:guid', verifyLoginToken, getBranch);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addBranch);
router.put('/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updateBranch);
router.delete('/:guid', verifyLoginToken, verifyPermissions, deleteBranch);

module.exports = router;

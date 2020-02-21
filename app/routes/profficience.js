const express = require('express');
const router = express.Router();

const {getProfficience, addProfficience, updateProfficience, deleteProfficience} = require('../controllers/profficience');
const {verifyLoginToken} = require('../validation/token');
const {verifyPermissions} = require('../validation/permissions');

router.get('/', verifyLoginToken, getProfficience);
router.put('/:id', verifyLoginToken, updateProfficience);
router.post('/',  verifyLoginToken, verifyPermissions, addProfficience);
router.delete('/:id',  verifyLoginToken, verifyPermissions, deleteProfficience);

module.exports = router;
const express = require('express');
const router = express.Router();

const {getProfficience, updateProfficience} = require('../controllers/profficience');
const {verifyLoginToken} = require('../validation/token');

router.get('/', verifyLoginToken, getProfficience);
router.put('/:id', verifyLoginToken, updateProfficience);

module.exports = router;
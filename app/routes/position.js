const express = require('express');
const { getPosition, getPositions, addPosition, updatePosition, deletePosition } = require('../controllers/position');
const { validateAddBody, validateUpdateBody } = require('../validation/branch');
const { verifyLoginToken } = require('../validation/token');
const { verifyPermissions } = require('../validation/permissions');

const router = express.Router();

router.get('/', verifyLoginToken, getPositions);
router.get('/:guid', verifyLoginToken, getPosition);
router.post('/', verifyLoginToken, verifyPermissions, validateAddBody, addPosition);
router.put('/:guid', verifyLoginToken, verifyPermissions, validateUpdateBody, updatePosition);
router.delete('/:guid', verifyLoginToken, verifyPermissions, deletePosition);

module.exports = router;

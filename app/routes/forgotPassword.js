const express = require('express');
const router = express.Router();

const {forgotPassword, checkForgotPasswordUser, changePassword} = require('../controllers/forgotPassword');
const {verifyForgotPasswordToken} = require('../validation/token');
const {validateForgotPasswordBody, validateForgotPasswordUpdateBody} = require('../validation/forgotPassword');

router.post('/', validateForgotPasswordBody, forgotPassword);
router.get('/change/:token', verifyForgotPasswordToken, checkForgotPasswordUser);
router.post('/change/:token', verifyForgotPasswordToken, validateForgotPasswordUpdateBody, changePassword);

module.exports = router;

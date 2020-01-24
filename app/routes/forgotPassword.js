const express = require('express');
const { forgotPassword, checkForgotPasswordUser, changePassword } = require('../controllers/forgotPassword');
const { verifyForgotPasswordToken } = require('../validation/token');
const { validateForgotPasswordBody } = require('../validation/forgotPassword');
const router = express.Router();

router.post('/', validateForgotPasswordBody, forgotPassword);
router.get('/change/:token', verifyForgotPasswordToken, checkForgotPasswordUser);
router.post('/change/:token', verifyForgotPasswordToken, changePassword);

module.exports = router;

const express = require("express");
const {
    forgotPassword,
    checkForgotPasswordUser,
    changePassword
} = require("../controllers/forgot-password");
const { verifyForgotPasswordToken } = require('../validation/token');
const { validateForgotPasswordBody  } = require("../validation/forgot-password");
const router = express.Router();

router.post("/", validateForgotPasswordBody, forgotPassword);
router.get("/change/:token", verifyForgotPasswordToken, checkForgotPasswordUser);
router.post("/change/:token", verifyForgotPasswordToken, changePassword);

module.exports = router;

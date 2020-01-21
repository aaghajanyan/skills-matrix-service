const express = require("express");
const {
    getUsers,
    getUser,
    signUp,
    updateUser,
    login
} = require("../controllers/user");
const { validateAddBody, validateUpdateBody, validateLoginBody } = require("../validation/users");
const { verifyLoginToken, verifyRegisterToken } = require('../validation/token');
const router = express.Router();

router.get("/", verifyLoginToken, getUsers);
router.get("/:guid", verifyLoginToken, getUser);
router.put("/:guid", verifyLoginToken, validateUpdateBody, updateUser);
router.post('/login', validateLoginBody, login);
router.post("/:token", verifyRegisterToken, validateAddBody, signUp);


module.exports = router;

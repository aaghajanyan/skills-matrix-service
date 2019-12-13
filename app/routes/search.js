const express = require("express");
const {
    findData
} = require("../controllers/search");
// const { validateAddBody, validateUpdateBody, validateLoginBody } = require("../validation/users");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.get("/", verifyLoginToken, findData);

module.exports = router;

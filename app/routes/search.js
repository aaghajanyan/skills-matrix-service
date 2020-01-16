const express = require("express");
const { searchUsers } = require("../controllers/search");
const { validateSearchBodySchema } = require("../validation/search");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.post("/", verifyLoginToken, searchUsers);

module.exports = router;

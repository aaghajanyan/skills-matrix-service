const express = require("express");
const { search, searchUsers } = require("../controllers/search");
const { validateSearchBodySchema } = require("../validation/search");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.post("/", verifyLoginToken, validateSearchBodySchema, search);
router.post("/v1", verifyLoginToken, searchUsers);

module.exports = router;

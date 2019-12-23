const express = require("express");
const { search } = require("../controllers/search");
const { validateSearchBodySchema } = require("../validation/search");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.post("/", verifyLoginToken, validateSearchBodySchema, search);

module.exports = router;

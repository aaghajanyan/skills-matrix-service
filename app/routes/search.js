const express = require("express");
const { findData } = require("../controllers/search");

const { validateSearchBodySchema } = require("../validation/search");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.get("/", verifyLoginToken, validateSearchBodySchema, findData);

module.exports = router;

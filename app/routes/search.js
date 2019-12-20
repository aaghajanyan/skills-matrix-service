const express = require("express");
const { findData } = require("../controllers/search");
const { findDataTest } = require("../controllers/search-test");
const { searchData } = require("../controllers/search-different-queries");
const { validateSearchBodySchema } = require("../validation/search");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.post("/", verifyLoginToken, validateSearchBodySchema, findData);
router.post("/v0", verifyLoginToken, validateSearchBodySchema, findDataTest);
router.post("/v1", verifyLoginToken, validateSearchBodySchema, searchData);

module.exports = router;

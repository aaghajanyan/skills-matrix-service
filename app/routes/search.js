const express = require("express");
const { findData } = require("../controllers/search");
const { findDataTest } = require("../controllers/search-test");
const { findDataWithDifferentQueries } = require("../controllers/search-different-queries");
const { validateSearchBodySchema } = require("../validation/search");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.post("/", verifyLoginToken, validateSearchBodySchema, findData);
router.post("/test", verifyLoginToken, validateSearchBodySchema, findDataTest);
router.post("/testik", verifyLoginToken, findDataWithDifferentQueries);

module.exports = router;

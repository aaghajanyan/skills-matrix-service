const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/search");
const { verifyLoginToken } = require('../validation/token');
const { getCriteries } = require("../controllers/criteria");

router.get("/:search_query", verifyLoginToken, searchUsers);
router.get("/", verifyLoginToken, getCriteries);

module.exports = router;

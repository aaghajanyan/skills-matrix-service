const express = require("express");
const {
    addInvitation,
    checkInvitationInDB
} = require("../controllers/invitation");
const { validateBody } = require("../validation/invitations");
const { verifyLoginToken } = require('../validation/token');
const { verifyPermissions } = require('../validation/permissions');

const router = express.Router();

router.head("/:id", checkInvitationInDB);
router.post("/", verifyLoginToken, verifyPermissions, validateBody, addInvitation);

module.exports = router;

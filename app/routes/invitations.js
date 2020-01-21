const express = require("express");
const {
    addInvitation,
    checkInvitationInDB
} = require("../controllers/invitation");
const { validateAddBody } = require("../validation/invitations");
const { verifyLoginToken, verifyRegisterToken } = require('../validation/token');
const { verifyPermissions } = require('../validation/permissions');

const router = express.Router();

router.head("/:token", verifyRegisterToken, checkInvitationInDB);
router.post("/", verifyLoginToken, verifyPermissions, validateAddBody, addInvitation);

module.exports = router;

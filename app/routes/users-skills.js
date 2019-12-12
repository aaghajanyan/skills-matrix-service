const express = require("express");
const {
    getSkillsRelations,
    getSkillRelation,
    addSkillRelation,
    updateSkillRelation,
    deleteSkillRelation
} = require("../controllers/skill-relation");
const { validateAddBody, validateUpdateBody } = require("../validation/skills-relations");
const { verifyLoginToken } = require('../validation/token');
const router = express.Router();

router.get("/", verifyLoginToken, getSkillsRelations);
router.get("/:skillRelationId", verifyLoginToken, getSkillRelation);
router.post("/", verifyLoginToken, validateAddBody, addSkillRelation);
router.put("/:skillRelationId", verifyLoginToken, validateUpdateBody, updateSkillRelation);
router.delete("/:skillRelationId", verifyLoginToken, deleteSkillRelation);

module.exports = router;

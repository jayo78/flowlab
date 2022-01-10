const express = require("express");
const router = express.Router();
const { createRoom, findRoom, createParticipant } = require("../controllers/roomController");

router.route("/").post(createRoom).get(findRoom);
router.post("/participants", createParticipant);

module.exports = router;

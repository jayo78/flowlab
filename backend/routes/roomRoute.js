const express = require("express");
const router = express.Router();
const {
    createRoom,
    findRoom,
    createParticipant,
    getActiveParticipants,
    getMessages,
} = require("../controllers/roomController");

router.route("/").post(createRoom).get(findRoom);
router.get("/:roomID/messages", getMessages);
router.get("/:roomID/participants", getActiveParticipants);
router.post("/:roomID/participants", createParticipant);

module.exports = router;

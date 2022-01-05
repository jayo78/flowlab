const express = require("express");
const router = express.Router();
const { createRoom, joinRoom, leaveRoom } = require("../controllers/roomController");

router.post("/", createRoom);
router.post("/join", joinRoom);

// router.route("/messages")
// .post(postMessage)
// .get(getMessages);

module.exports = router;

const mongoose = require("mongoose");

const participantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    anon: {
        type: Boolean,
        required: true,
    },
    roomID: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        ref: "Room",
    },
    userID: {
        type: mongoose.Schema.Types.ObjectID,
        required: false,
        ref: "User",
    },

    // time join
    // time leave
});

Participant = mongoose.model("Participant", participantSchema);
module.exports = Participant;

const mongoose = require("mongoose");

// const uuidv4 = require("uuid");

const messageSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true, // insert func to validate
            // content & check room association
        },
        participant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Participant",
        },
    },
    { timestamps: true }
);

Message = mongoose.model("Message", messageSchema);
module.exports = Message;

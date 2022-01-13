const mongoose = require("mongoose");

// const uuidv4 = require("uuid");

const messageSchema = mongoose.Schema(
    {
    content: {
        type: String,
        required: true,  // insert func to validate 
                        // content & check room association
    },
    participant:  {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Participant"
    },
    },
    { timestamps: true, }
);

const roomSchema = mongoose.Schema(
    {
        // _id: {
        // type: String,
        // default: () => uuidv4().replace(/\-/g, "")
        // },
        type: String,
        creator_id: String,
        messages: [messageSchema]
    },
    { timestamps: true }
);

Room = mongoose.model("Room", roomSchema);
module.exports = Room;

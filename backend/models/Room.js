const mongoose = require("mongoose");
// const uuidv4 = require("uuid");

const roomSchema = mongoose.Schema(
    {
        // _id: {
        // type: String,
        // default: () => uuidv4().replace(/\-/g, "")
        // },
        type: String,
        creator_id: String,
    },
    { timestamps: true }
);

Room = mongoose.model("Room", roomSchema);
module.exports = Room;

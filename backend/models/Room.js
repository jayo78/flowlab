const mongoose = require("mongoose");

// const uuidv4 = require("uuid");

const roomSchema = mongoose.Schema(
    {
        type: String,
        creator_id: String,
        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
        activeTasks: [
            {
                type: mongoose.Schema.Types.ObjectID,
                ref: 'Task'
            }
        ],
        finishedTasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task'
            }
        ],
    },
    { timestamps: true }
);

Room = mongoose.model("Room", roomSchema);
module.exports = Room;

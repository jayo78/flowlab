const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
    {
        name: String,
        creator_id: String,
        description: String,
        completed: Boolean,
        dateCreated: Date,
        dateDeadline: Date,
        dateCompleted: Date,
    }
);

Task = mongoose.model("Task", taskSchema);
module.exports = Task;

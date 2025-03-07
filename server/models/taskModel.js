const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    exp: {
        type: Number,
        required: true,
    },
    tutorial: {
        type: Array,
        required: true,
    },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

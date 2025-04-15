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
  _length: {
    type: Number,
    required: true,
    min: 1,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

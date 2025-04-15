const mongoose = require("mongoose");

const ProcessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  startTime: { type: Date, default: Date.now },
  duration: { type: Number }, // in seconds
  progress: { type: Number, default: 0 }, // 0-100%
  completed: { type: Boolean, default: false },
});

const Process = mongoose.model("Process", ProcessSchema);

module.exports = Process;

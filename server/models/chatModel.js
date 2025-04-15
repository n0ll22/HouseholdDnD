const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String },
    isGroup: { type: Boolean, required: true },
    participants: { type: Array, required: true, ref: "User" },
    latest: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);

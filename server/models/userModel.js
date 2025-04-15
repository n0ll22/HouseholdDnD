const mongoose = require("mongoose");
const friendshipModel = require("./friendshipModel");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  exp: {
    type: Number,
    required: true,
  },
  lvl: {
    type: Number,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  taskToday: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Task",
    required: true,
  },
  friendships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comrade",
      required: false,
    },
  ],
  description: {
    type: String,
    required: false,
  },
  clan: {
    type: String,
    required: false,
  },
  pendingClan: {
    clanId: {
      type: String,
      required: false,
    },
    accepted: {
      type: Boolean,
      required: false,
    },
  },
  banner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["online", "offline", "deleted"],
  },
  socketId: String,
  resetToken: String,
  resetTokenExpiry: Date,
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

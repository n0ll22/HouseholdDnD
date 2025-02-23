const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    chatId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;

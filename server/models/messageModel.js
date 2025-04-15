const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    chatId: {type:mongoose.Schema.Types.ObjectId, ref: "Chat", required: true},
    content: {type: String, required: true},
    seen: {type: Boolean, required: true, default: false}
}, {timestamps: true})

module.exports = mongoose.model('Message', messageSchema)
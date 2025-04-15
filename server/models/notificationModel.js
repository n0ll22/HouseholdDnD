const mongoose = require("mongoose");

/**
 * @typedef {import('mongoose').Document} Document
 * @typedef {import('mongoose').Model} Model
 */

/**
 * @type {Model<Document>}
 */

const notificationSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    read: {
        type: Boolean,
        reqired: true,
    },
});

const Notification = new mongoose.model("Notification", notificationSchema);

module.exports = Notification;

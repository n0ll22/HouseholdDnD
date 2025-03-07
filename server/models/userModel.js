const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
        type: Array,
        required: true,
    },
    comrades: {
        type: Array,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    clan: {
        type: String,
        required: false,
    },
    equipment: {
        leftHand: {
            type: Object,
            required: false,
        },
        rightHand: {
            type: Object,
            required: false,
        },
        head: {
            type: Object,
            required: false,
        },
        body: {
            type: Object,
            required: false,
        },
        legs: {
            type: Object,
            required: false,
        },
        feet: {
            type: Object,
            required: false,
        },
    },
    pendingComrade: [
        {
            userId: {
                type: String,
                required: false,
            },
            sender: {
                type: String,
                required: true,
            },
        },
    ],
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;

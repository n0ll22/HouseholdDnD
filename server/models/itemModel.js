const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    effect: {
        type: Object,
        required: true,
    },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;

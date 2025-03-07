const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true,
    },
    leader: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const Clan = mongoose.model("Clan", clanSchema);

module.exports = Clan;

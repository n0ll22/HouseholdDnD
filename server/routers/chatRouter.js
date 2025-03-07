const express = require("express");
const auth = require("../middleware/auth");
const Chat = require("../models/chatModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  try {
    // A middleware (auth) hozzáadja a felhasználói információt a request objektumhoz
    const userId = req.params.id;

    // Keresés azokkal a csetszobákkal, ahol a participants tömb tartalmazza a bejelentkezett felhasználó ID-ját
    const chats = await Chat.find({
      participants: userId, // Az ID a participants tömbben szerepel
    }).populate("participants", "username avatar");

    console.log("E-csetek", chats);

    if (chats.length === 0) {
      return res.status(404).json({ message: "Nincs elérhető csetszoba" });
    }

    // A csetszobák visszaadása
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hiba történt a csetszobák lekérésekor" });
  }
});

// Create or fetch a one-on-one chat
router.post("/", auth, async (req, res) => {
  try {
    const { participants } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    const result = await Chat.findOne({
      isGroup: false,
      participants: { $all: participants },
    });

    if (result) {
      return res.status(400).json({ message: "Chatroom already exists" });
    }

    if (participants.length === 2) {
      await Chat.create({ isGroup: false, participants });
    } else if (participants.length > 2) {
      await Chat.create({ isGroup: true, participants });
    }

    res.status(200).json({ message: "Chat Created!" });
  } catch (err) {
    res.status(500).json({ message: "Error creating/fetching chat", err });
  }
});

module.exports = router;

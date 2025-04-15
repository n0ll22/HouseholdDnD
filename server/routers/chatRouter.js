const express = require("express");
const auth = require("../middleware/auth");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const queryOptions = require("../queryOptions");

const router = express.Router();

// Create or fetch a one-on-one chat
router.post("/", auth, async (req, res) => {
  try {
    const { participants } = req.body;

    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    if (participants.length > 2) {
      const existingChat = await Chat.findOne({
        isGroup: true,
        participants: { $all: participants },
      });

      if (existingChat) {
        return res.status(400).json({ message: "Chatroom already exists" });
      }
    } else {
      const existingChat = await Chat.findOne({
        isGroup: false,
        participants: { $all: participants },
      });

      if (existingChat) {
        return res.status(400).json({ message: "Chatroom already exists" });
      }
    }

    const newChat = await Chat.create({
      isGroup: participants.length > 2,
      participants,
    });

    res.status(200).json({ message: "Chat Created!", chat: newChat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating/fetching chat", err });
  }
});

router.get("/getOneByParticipants", async (req, res) => {
  try {
    const { user1, user2, onlyId } = req.query;

    console.log(user1, user2);

    const userIds = [user1, user2];

    console.log(userIds);

    const result = await Chat.findOne({ participants: { $all: userIds } });

    if (result) {
      if (onlyId) {
        return res.send({ chatId: result._id });
      }
      return res.send(result);
    } else {
      const newChat = await Chat.create({
        isGroup: false,
        participants: [user1, user2],
      });

      res.status(202).send({ message: "Chat created!", chatId: newChat._id });
    }
  } catch (error) {}
});

router.post("/messages", auth, async (req, res) => {
  try {
    const { senderId, chatId, content } = req.body;

    const newMessage = await Message.create({
      senderId,
      chatId,
      content,
    });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latest: newMessage._id });

    res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending message", error });
  }
});

router.get("/messages/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Message.find({ chatId: id }).populate(
      "senderId",
      "username avatar"
    );

    if (result) {
      res.json(result);
    } else {
      res.status(202).send({ message: "no data" });
    }
  } catch (error) {}
});

router.get("/getByParticipants/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Find chats where the user is a participant
    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "username avatar status") // Populate participants
      .populate("latest", "senderId content");

    if (!chats) {
      return res.status(404);
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat rooms" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find chats where the user is a participant
    const chat = await Chat.findById(id).populate(
      "participants",
      "username avatar status"
    ); // Populate participants

    const messages = await Message.find({ chatId: id }).populate(
      "senderId",
      "username avatar status"
    );

    if (!chat || !messages) {
      return res.status(404);
    }

    res.status(200).json({ chat, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat rooms" });
  }
});

module.exports = router;

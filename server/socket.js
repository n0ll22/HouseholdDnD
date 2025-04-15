const { Server } = require("socket.io");
const Chat = require("./models/chatModel");
const Message = require("./models/messageModel");
const User = require("./models/userModel");
const Friendship = require("./models/friendshipModel");

const onlineUsers = {};
const disconnectTimeouts = {};

const socket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 15000,
  });

  io.on("connection", async (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", async (reason) => {
      console.log(`Socket ${socket.id} disconnected. Reason: ${reason}`);

      // Find the user associated with the socket
      const user = await User.findOne({ socketId: socket.id });

      if (user) {
        // Set a delay (e.g. 5 seconds) before marking offline
        disconnectTimeouts[user._id] = setTimeout(async () => {
          // Check if user is still disconnected (not reconnected)
          const freshUser = await User.findById(user._id);
          if (freshUser?.socketId === "" || freshUser?.socketId === socket.id) {
            freshUser.status = "offline";
            freshUser.socketId = "";
            await freshUser.save();

            io.emit("receive_status", {
              username: freshUser.username,
              avatar: freshUser.avatar,
              status: freshUser.status,
              _id: freshUser._id,
            });
          }

          // Clean up timeout
          delete disconnectTimeouts[user._id];
        }, 5000); // 5 seconds
      }
    });
    // Register user
    socket.on("register_user", async (userId) => {
      try {
        if (userId) {
          onlineUsers[userId] = socket.id;
          const user = await User.findByIdAndUpdate(userId, {
            status: "online",
            socketId: socket.id,
          });

          io.emit("receive_status", user); // Broadcast to all clients
        }
      } catch (err) {
        console.error("Error during registration:", err);
      }

      console.log(onlineUsers);
    });

    // Handle sending a friend request
    socket.on("send_friendRequest", async ({ senderId, receiverId }) => {
      try {
        const alreadyAdded = await Friendship.findOne({
          senderId,
          receiverId,
        });

        if (alreadyAdded?.status === "blocked") {
          return socket.emit("friendRequest_error", {
            message:
              "User blocked! If you blocked the other user, you can unblock it in the Options tab",
          });
        }

        if (alreadyAdded && alreadyAdded.status !== "refused") {
          return socket.emit("friendRequest_error", {
            message: "Already sent!",
          });
        }

        const friendship = new Friendship({
          senderId,
          receiverId,
          status: "pending",
        });
        await friendship.save();

        await User.findByIdAndUpdate(receiverId, {
          $push: { friendships: friendship._id },
        });
        await User.findByIdAndUpdate(senderId, {
          $push: { friendships: friendship._id },
        });

        const friendRequest = await Friendship.findById(friendship._id)
          .populate(["senderId", "receiverId"], "username avatar lvl")
          .lean();

        // Construct a final data object that matches the expected type
        const finalData = {
          currentUser: {
            _id: friendRequest.receiverId._id,
            avatar: friendRequest.receiverId.avatar,
            username: friendRequest.receiverId.username,
            lvl: friendRequest.receiverId.lvl,
          },
          otherUser: {
            _id: friendRequest.senderId._id,
            avatar: friendRequest.senderId.avatar,
            username: friendRequest.senderId.username,
            lvl: friendRequest.senderId.lvl,
          },
          _id: friendRequest._id, // Make sure the friendship ID is provided
          status: friendRequest.status, // This should be "pending"
        };

        // Notify the receiver if online
        const receiverSocket = onlineUsers[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_friendRequest", finalData);
        }

        // Notify the sender of success
        socket.emit("friendRequest_sent", friendRequest);
      } catch (err) {
        console.error(err);
        socket.emit("friendRequest_error", {
          message: "Failed to send friend request.",
        });
      }
    });

    // Cancel a sent friend request
    socket.on(
      "unsend_friendRequest",
      async ({ chatId, loggedInUserId, userId }) => {
        try {
          console.log(chatId, loggedInUserId, userId);

          await Friendship.findByIdAndDelete(chatId);

          await User.findByIdAndUpdate(loggedInUserId, {
            $pull: { friendships: chatId },
          });

          await User.findByIdAndUpdate(userId, {
            $pull: { friendships: chatId },
          });

          const deleteData = {
            _id: chatId,
          };

          const loggedInSocket = onlineUsers[loggedInUserId];
          const otherSocket = onlineUsers[userId];

          if (loggedInSocket) {
            io.to(loggedInSocket).emit(
              "receive_unsent_friendRequest",
              deleteData
            );
          }

          if (otherSocket) {
            io.to(otherSocket).emit("receive_unsent_friendRequest", deleteData);
          }
        } catch (error) {
          console.error("Unsend friend request error:", error);
        }
      }
    );

    // Answer friend request
    socket.on(
      "answer_friendRequest",
      async ({ id, status, senderId, receiverId }) => {
        try {
          console.log("answer data: ", id, status, senderId, receiverId);
          switch (status) {
            case "accepted":
              await Friendship.findByIdAndUpdate(id, { status });
              break;
            case "refused":
              await Friendship.findByIdAndDelete(id);
              await User.updateMany(
                { friendships: id },
                { $pull: { friendships: id } }
              );
              break;
            case "blocked":
              await Friendship.findByIdAndUpdate(id, {
                status,
                blockedBy: receiverId,
              });
              break;
          }

          // Return updated friendship object to both users
          const result = await Friendship.findById(id).populate(
            ["senderId", "receiverId"],
            "username avatar lvl"
          );

          const senderSocket = onlineUsers[senderId._id];
          const receiverSocket = onlineUsers[receiverId._id];

          console.log("HILFE", senderSocket, receiverSocket);

          if (status === "refused") {
            if (senderSocket) {
              io.to(senderSocket).emit("receive_friendRequest_answer", {
                _id: id,
                status,
              });
            }

            if (receiverSocket) {
              io.to(receiverSocket).emit("receive_friendRequest_answer", {
                _id: id,
                status,
              });
            }
          } else {
            const updatedFriendship = {
              _id: result._id,
              __v: result.__v,
              currentUser: result.receiverId,
              otherUser: result.senderId,
              status: result.status,
            };

            console.log("Updated Fr:", updatedFriendship);

            if (senderSocket) {
              io.to(senderSocket).emit(
                "receive_friendRequest_answer",
                updatedFriendship
              );
            }

            if (receiverSocket) {
              io.to(receiverSocket).emit(
                "receive_friendRequest_answer",
                updatedFriendship
              );
            }
          }
        } catch (err) {
          console.error("Error answering friend request:", err);
        }
      }
    );

    // Send a message
    socket.on("send_message", async ({ chatId, senderId, content }) => {
      try {
        console.log("Chat: " + chatId);
        const message = new Message({ senderId, chatId, content });
        await message.save();

        await Chat.findByIdAndUpdate(chatId, { latest: message._id });

        const populatedMessage = await Message.findById(message._id)
          .populate("senderId", "username avatar")
          .lean();
        console.log("send_message:", populatedMessage);

        // Emit to all users in this chat room
        io.to(chatId).emit("receive_message", populatedMessage);

        // (Optional) Broadcast a general notification to others
        io.emit("newMessage", populatedMessage);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("join_chat", async (chatId) => {
      console.log("User connected to chat room: ", chatId);
      socket.join(chatId);
    });

    socket.on("new_chat", async (participantIds) => {
      try {
        console.log(participantIds);
        if (!participantIds || participantIds.length < 2) {
          return console.error("No Ids");
        }

        if (participantIds.length > 2) {
          const existingChat = await Chat.findOne({
            isGroup: true,
            participants: { $all: participantIds },
          });

          if (existingChat) {
          }
        } else {
          const existingChat = await Chat.findOne({
            isGroup: false,
            participants: { $all: participantIds },
          });

          if (existingChat) {
            return console.error("Already created!");
          }
        }

        const newChat = await Chat.create({
          isGroup: participantIds.length > 2,
          participants: participantIds,
        });

        await newChat.populate("participants", "username avatar");

        socket.emit("receive_new_chat", newChat);
      } catch (err) {
        console.error(err);
      }
    });

    // Handle disconnection
  });
};

module.exports = socket;

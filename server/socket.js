const { Server } = require('socket.io');
const Chat = require('./models/chatModel');
const Message = require('./models/messageModel');

const socket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    // Watch for changes in the Chat collection (e.g., new chat room creation)
    const chatChange = Chat.watch();

    chatChange.on("change", (change) => {
        if (change.operationType === "insert") {
            const newChatRoom = change.fullDocument;

            // Emit event to notify all clients about the new chat room
            io.emit("newChatRoom", newChatRoom);
        }
    });

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        // Join chat room
        socket.on('join_chat', (chatId) => {
            socket.join(chatId);
        });

        // Handle sending messages
        socket.on("send_message", async ({ chatId, senderId, content }) => {
            try {
                const message = new Message({ senderId, chatId, content });
                await message.save();
                await Chat.findByIdAndUpdate(chatId, { latest: message._id });

                // Emit message to all clients in the chat room
                io.to(chatId).emit("receive_message", message);
            } catch (err) {
                console.error("Error has occurred:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

module.exports = socket;

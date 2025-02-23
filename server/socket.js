// socket.js
const { Server } = require("socket.io");

const socketHandler = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Specify allowed origins
            methods: ["GET", "POST"],
        },
    });

    // Handle connection
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Example: Listen for a message event
        socket.on("sendMessage", (data) => {
            console.log("Message received:", data);
            // Broadcast the message to all clients
            io.emit("receiveMessage", data);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = socketHandler;

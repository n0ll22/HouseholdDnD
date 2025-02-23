const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cp = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketHandler = require("./socket");
const app = express();

const server = http.createServer(app);

socketHandler(server);

// Load environment variables
dotenv.config("./.env");

// Create MySQL connection
mongoose
    .connect(
        process.env.MONGODB_CON ||
            "mongodb+srv://remibende:xWvFQfEt0DXzm8ff@householddndcluster.e3vvfbm.mongodb.net/"
    )
    .then(() => console.log("Connected to MongoDB"));

// Initialize Express app

// Middleware
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(cp());
app.use(express.json());

// Routes
app.use("/user", require("./routers/userRouter"));
app.use("/task", require("./routers/taskRouter"));
app.use("/notification", require("./routers/notificationRouter"));

// Default route
app.get("/", (req, res) => {
    res.status(200).send({ message: "SERVER RESPONSE OK" });
});

app.use((req, res, next) => {
    res.status(404).send("Az oldal nem található");
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server started. Listening on port ${PORT}`);
});

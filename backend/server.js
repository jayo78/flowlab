require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");

// Middleware Config
app.use(express.json());

// Routes Config
app.use("/api/users", userRoute);
app.use("/api/rooms", roomRoute);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch((err) => console.log(err));

// Server Config
const port = process.env.PORT || 4000;

io.on("connection", (socket) => {
    console.log("client connected");
    socket.on("disconnect", () => {
        console.log("client disconnect");
    });

    socket.on("join", ({ name, room }) => {
        console.log(name + " joined room " + room);
    });

    socket.on("sendMessage", (message) => {
        console.log("sent message: " + message);
    });
});

server.listen(port, "0.0.0.0");
server.on("listening", () => {
    console.log(`Listening on port:: ${port}`);
});

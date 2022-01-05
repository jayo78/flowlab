require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");

const app = express();

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

const server = app.listen(port, "0.0.0.0");
// const io = require("socket.io").listen(server);

// io.on("connection", (socket) => {
// console.log("client connected");
// socket.on("disconnect", () => {
// console.log("client disconnect");
// });

// socket.on("join", ({ name, room }) => {
// console.log(name + " joined room " + room);
// });

// socket.on("send message", (message) => {
// console.log("sent message: " + message);
// });
// });

server.on("listening", () => {
    console.log(`Listening on port:: ${port}`);
});

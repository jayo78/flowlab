require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const userRoute = require("./routes/userRoute");
const roomRoute = require("./routes/roomRoute");
const handler = require("./iohandler");
const connectDB = require("./config/db");

// Middleware Config
app.use(express.json());

// Routes Config
app.use("/api/users", userRoute);
app.use("/api/rooms", roomRoute);

if (process.env.NODE_ENV == "production") {
    // if production then serve the frontend build
    app.get("*", (_req, res) => {
        res.sendFile(path.resolve(rootdir, "frontend", "build", "index.html"));
    });
} else {
    // not production so API and frontend on separate ports
    app.get("/", (_req, res) => {
        res.send("API running");
    });
}

// server startup
const port = process.env.PORT || 4000;

server.listen(port, "0.0.0.0", async () => {
    await connectDB();
    console.log(`[Server][${process.env.NODE_ENV}] running on port ${port}`);
});

// io init
io.on("connection", handler);

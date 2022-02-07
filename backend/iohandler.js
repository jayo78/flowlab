const {
    addParticipant,
    getParticipants,
    participantInRoom,
    removeParticipant,
    roomExists,
} = require("./rooms");
const Participant = require("./models/Participant");
const Room = require("./models/Room");
const Message = require("./models/Message");

// TODO: add validation/auth as socket middleware
// NOTE: no error handling - implement (prob with callbacks) so client gets error
const validate = (roomID, participantID) => {
    console.log(
        "[IOHandler] validating participantID: " + participantID + " roomID: " + roomID
    );

    if (!roomExists(roomID)) console.error("\troom doesn't exist");

    Participant.findOne({ _id: participantID }).then((participant) => {
        if (!participant) console.error("\tparticipant not found");
    });

    if (!participantInRoom(roomID, participantID)) console.error("\tparticipant not in room");
};

const handler = (socket) => {
    console.log("[IOHandler] client connected");

    socket.on("join", async (data) => {
        console.log("[IOHandler] join");
        const { participantInfo } = data;
        const { _id, name, roomID } = participantInfo;

        if (!participantInRoom(roomID, _id)) {
            console.log("\tadding participant");
            addParticipant(roomID, _id);
        }

        validate(roomID, _id);
        socket.join(roomID);

        socket.roomID = roomID;
        socket.pID = _id;
        socket.username = name;

        socket.emit("participantLoaded");
        socket.to(roomID).emit("participantJoin", participantInfo);
        console.log("\tparticipant loaded");
    });

    socket.on("sendMessage", async (data) => {
        console.log("[IOHandler] sendMessage");
        const { messageContent, participantInfo } = data;
        const { _id, roomID } = participantInfo;
        validate(roomID, _id);
        console.log("\t" + _id + " sent message: " + messageContent + " to room: " + roomID);

        let room = await Room.findOne({ _id: roomID });
        if (!room) {
            console.error("Room DNE");
            // HANDLE ERROR - EXIT EARLY
        }

        let newMessage = await Message.create({
            content: messageContent,
            participant: _id,
        });

        room.messages.push(newMessage);
        await room.save();

        // after saving, broadcast message to room
        const messageData = {
            content: messageContent,
            participant: participantInfo,
            createdAt: newMessage.createdAt,
        };

        // broadcast to room as well as sender
        socket.to(socket.roomID).emit("message", messageData);
        socket.emit("message", messageData);
        console.log("\tmessage broadcasted");
    });

    socket.on("disconnect", () => {
        console.log("[IOHandler] disconnected");
        socket.leave(socket.roomID);
        removeParticipant(socket.roomID, socket.pID);
        socket.to(socket.roomID).emit("participantLeave", socket.pID);
        socket.leave(socket.roomID);
    });
};

module.exports = handler;

const {
    addParticipant,
    participantInRoom,
    removeParticipant,
    roomExists,
} = require("./rooms");
const Participant = require("./models/Participant");
const { Server } = require("socket.io");

// TODO: add validation/auth as socket middleware
// NOTE: no error handling - implement (prob with callbacks) so client gets error
const validate = (roomID, participantID) => {
    console.log("[Handler] validating from socket");
    console.log(roomID);
    if (!roomExists(roomID)) console.log("[Handler] room doesn't exist");

    Participant.findOne({ _id: participantID }).then((participant) => {
        if (!participant) console.log("[Handler] participant not found");
    });

    if (!participantInRoom(roomID, participantID))
        console.log("[Handler] participant not in room");
};

const handler = (socket) => {
    console.log("[Handler] client connected");

    socket.on("join", (data) => {
        console.log("[Handler] join");
        const { participantInfo } = data;
        const { _id, name, roomID } = participantInfo;

        validate(roomID, _id);
        socket.join(roomID);

        socket.roomID = roomID;
        socket.participantID = _id;
        socket.username = name;
        socket.emit("participantLoaded");
    });

    socket.on("sendMessage", (data) => {
        console.log("[Handler] sendMessage");
        const { message, participantInfo } = data;
        const { _id, name, roomID } = participantInfo;
        validate(roomID, _id);
        console.log("[Handler] " + _id + " sent message: " + data + " to room: " + roomID);

        // broadcast message to room
        socket.to(socket.roomID).emit("message", {
            name: name,
            message: message,
        });
        socket.emit("message", {
            name: name,
            message: message,
        });
    });

    socket.on("disconnect", () => {
        // leave the room and remove it if there are no more participants
        console.log("disconnected");
        socket.leave(socket.roomID);
        removeParticipant(socket.roomID, socket.participantID);
        // if (getRoom(socket.roomID).length <= 0) {
        // console.log('no more participants');
        // removeRoom(socket.roomID);
        // } else {
        // // broadcast leave
        // }
    });
};

module.exports = handler;

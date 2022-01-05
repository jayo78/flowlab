// In memory room management
// hold transient room information, primarily a list of participants for a room
// for persistent room data, use the room model (mongo)

//
// map room ids to array of participants
let rooms = new Map();
let CAPACITY = 4;

//
// return whether a participant is in a room
const participantInRoom = (roomID, participantID) => {
    if (!rooms.has(roomID)) return false;

    let participantList = rooms.get(roomID);
    return participantList.includes(participantID);
};

const addParticipant = (roomID, participantID) => {
    console.log("adding participant " + participantID + " to room " + roomID);
    if (!rooms.has(roomID)) {
        console.log("failed: room doesn't exist");
        return false;
    }

    let participantList = rooms.get(roomID);
    if (participantList.length >= CAPACITY) {
        console.log("failed: list full");
        return false;
    }

    participantList.push(participantID);
    rooms.set(roomID, participantList);
    return true;
};

const removeParticipant = (roomID, participantID) => {
    if (!participantInRoom(roomID, participantID)) return false;

    console.log("removing participant " + participantID + " from room " + roomID);
    let participantList = rooms.get(roomID);
    let idx = participantList.indexOf(participantID);
    participantList.splice(idx, 1);
    rooms.set(roomID, participantList);
    return true;
};

const addRoom = (roomID) => {
    console.log("adding new room " + roomID);
    // set new room to empty participant list
    rooms.set(roomID, []);
};

const removeRoom = (roomID) => {
    if (!rooms.has(roomID)) return false;

    console.log("deleting room " + roomID);
    rooms.delete(roomID);
    return true;
};

const connectionHandler = (socket) => {
    // auth middleware

    socket.on("disconnect", () => {
        console.log("disconnected");
        // handle disconnect
    });

    socket.on("sendMessage", (message) => {
        console.log("sendMessage" + message);
        // handle message
    });

    socket.on("test", () => {
        console.log(`recved test from socket ${socket}`);
        socket.emit("test", "test recved");
    });
};

module.exports = {
    connectionHandler,
    participantInRoom,
    removeParticipant,
    addParticipant,
    removeRoom,
    addRoom,
};

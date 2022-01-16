// In memory room management
// hold transient room information, primarily a list of participants for a room
// for persistent room data, use the room model (mongo)

//
// map room ids to array of participants
let rooms = new Map();
let CAPACITY = 4;

const participantInRoom = (roomID, participantID) => {
    console.log("[Rooms] check " + participantID + " in room " + roomID);
    if (!rooms.has(roomID)) {
        console.error("\tfailed: room does not exist");
        return false;
    }

    let participantList = rooms.get(roomID);
    return participantList.includes(participantID);
};

const addParticipant = (roomID, participantID) => {
    console.log("[Rooms] adding participant " + participantID + " to room " + roomID);
    if (!roomExists(roomID)) {
        console.error("\tfailed: room doesn't exist");
        return false;
    }

    if (!roomHasSpace(roomID)) {
        console.error("\tfailed: list full");
        return false;
    }

    let participantList = rooms.get(roomID);
    participantList.push(participantID);
    rooms.set(roomID, participantList);
    return true;
};

const removeParticipant = (roomID, participantID) => {
    console.log("[Rooms] removing participant " + participantID + " from room " + roomID);
    if (!participantInRoom(roomID, participantID)) {
        console.error("\tfailed: participant not in room");
        return false;
    }

    let participantList = rooms.get(roomID);
    let idx = participantList.indexOf(participantID);
    participantList.splice(idx, 1);
    rooms.set(roomID, participantList);
    console.log("\tparticipant removed");
    return true;
};

const addRoom = (roomID) => {
    console.log("[Rooms] adding new room " + roomID);
    // set new room to empty participant list
    rooms.set(roomID, []);
};

const removeRoom = (roomID) => {
    console.log("[Rooms] removing room " + roomID);
    if (!roomExists(roomID)) {
        console.error("failed: room does not exists");
        return false;
    }

    rooms.delete(roomID);
    return true;
};

const roomExists = (roomID) => {
    return rooms.get(roomID) != null;
};

const roomHasSpace = (roomID) => {
    return rooms.get(roomID).length < CAPACITY;
};

const getOpenRoom = () => {
    console.log("[Rooms] getOpenRoom");
    for (let [roomID, list] of rooms.entries()) {
        if (list.length < CAPACITY) {
            console.log("\topen room found: " + roomID);
            return roomID;
        }
    }

    console.log("\tno open room found");
    return null;
};

const cleanEmptyRooms = () => {
    for (let [roomID, list] of rooms) {
        if (list.length <= 0) {
            rooms.delete(roomID);
        }
    }
};

module.exports = {
    participantInRoom,
    roomHasSpace,
    roomExists,
    removeParticipant,
    addParticipant,
    removeRoom,
    getOpenRoom,
    addRoom,
};

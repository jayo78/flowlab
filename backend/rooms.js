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
    console.log("[Rooms] check " + participantID + " in room " + roomID);
    console.log(rooms);
    if (!rooms.has(roomID)) return false;

    let participantList = rooms.get(roomID);
    return participantList.includes(participantID);
};

const addParticipant = (roomID, participantID) => {
    console.log("[Rooms] adding participant " + participantID + " to room " + roomID);
    if (!roomExists(roomID)) {
        console.log("failed: room doesn't exist");
        return false;
    }

    if (!roomHasSpace(roomID)) {
        console.log("failed: list full");
        return false;
    }

    let participantList = rooms.get(roomID);
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
    console.log("[Rooms] adding new room " + roomID);
    console.log(rooms);
    // set new room to empty participant list
    rooms.set(roomID, []);
    console.log(rooms);
};

const removeRoom = (roomID) => {
    if (!rooms.has(roomID)) return false;

    console.log("deleting room " + roomID);
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
            console.log("open room found: " + roomID);
            return roomID;
        }
    }

    return null;
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

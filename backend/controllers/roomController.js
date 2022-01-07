const User = require("../models/User");
const Participant = require("../models/Participant");
const Room = require("../models/Room");
const {
    addRoom,
    addParticipant,
    removeRoom,
    removeParticipant,
    participantInRoom,
} = require("../rooms");

/*
 * create room is only hit by users and not used when the backend itself is spinning up rooms.
 * rooms created by users should always be private
 * */
const createRoom = async (req, res) => {
    let { userID } = req.body;

    const userExists = await User.findOne({ _id: userID });
    if (!userExists) {
        console.log("createRoom: user not found");
        return res.status(400).json({ message: "user not found" });
    }

    const newRoom = await Room.create({
        creator_id: userID,
        type: "private",
    });

    console.log("room created");
    console.log(newRoom);

    // add room to rooms map
    addRoom(newRoom._id.toString());

    return res.status(201).json({
        _id: newRoom._id,
        creator_id: newRoom.creator_id,
        type: newRoom.type,
    });
};

// can join room as anon participant or reference an authed user
const joinRoom = async (req, res) => {
    let { roomID, userID, name } = req.body;

    const room = await Room.findOne({ _id: roomID });
    if (!room) {
        console.log("room not found");
        return res.status(400).json({ message: "room not found" });
    }

    const user = await User.findOne({ _id: userID });
    const newParticipant = await Participant.create({
        name: name,
        anon: user == null,
        roomID: roomID,
        userID: userID,
    });

    console.log("participant join");
    console.log(newParticipant);

    // NOTE: if fail to add participant to room, the newParticipant object was still created
    // and just not returned

    // attempt to add the new participant to the room
    if (participantInRoom(roomID, newParticipant._id))
        return res.status(400).json({ message: "already in room" });

    if (!addParticipant(roomID, newParticipant._id))
        return res.status(400).json({ message: "room at capacity" });

    return res.status(201).json({
        _id: newParticipant._id,
        name: newParticipant.name,
        anon: newParticipant.anon,
        roomID: newParticipant.roomID,
        userID: newParticipant.userID,
    });
};

// const getParticipants = async (req, res) => {

// }

// const getTimer = async (req, res) => {

// }

module.exports = {
    createRoom,
    joinRoom,
};
